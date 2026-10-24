import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('js/app.js', 'utf8');
const functions = source.slice(source.indexOf('  function buildContactForm('), source.indexOf('  function buildContact()'));
const content = { window: {} };
vm.runInNewContext(fs.readFileSync('js/content.js', 'utf8'), content);
function el(tag, props = {}, children = []) {
  props ||= {};
  return {
    tag, props, children, value: props.value || '', required: props.required != null, disabled: false, hidden: props.hidden != null,
    listeners: {},
    appendChild(child) { this.children.push(child); },
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); },
    change(value, type = 'input') { this.value = value; const event = { target: this }; this.props['on' + type]?.(event); (this.listeners[type] || []).forEach(fn => fn(event)); },
    setAttribute(key, value) { this.props[key] = value; }, focus() { this.focused = true; },
    reportValidity() {
      const valid = node => !(node.required && !node.value) && (node.children || []).filter(c => c && typeof c === 'object').every(valid);
      return this.valid !== false && valid(this);
    },
    querySelector(selector) {
      const name = /name="([^"]+)"/.exec(selector)?.[1];
      const classes = selector.startsWith('.') ? selector.slice(1).split('.') : [];
      const match = n => name ? n.props?.name === name : classes.every(c => (n.props?.class || '').split(' ').includes(c));
      const walk = n => match(n) ? n : (n.children || []).filter(c => c && typeof c === 'object').map(walk).find(Boolean);
      return walk(this);
    }
  };
}
function setup(lang, fetchImpl, analyticsThrows = false) {
  let current, submitted, calls = 0;
  const goals = [];
  const c = {
    el, state: { lang, service: '' }, formDraft: { name: 'TEST ONLY', phone: '+374 00000000', email: '', message: 'TEST ONLY', contact_method: '' }, formSending: false, formError: false,
    window: { SiteAnalytics: { goal: id => { goals.push(id); if (analyticsThrows) throw Error('Analytics unavailable'); } } },
    t: () => content.window.CONTENT[c.state.lang], document: { querySelector: selector => current.querySelector(selector) },
    setState: patch => { Object.assign(c.state, patch); current = c.build(); },
    FormData: class {
      constructor(form) {
        this.extra = []; this.fields = {};
        const collect = node => { if (node.props?.name) this.fields[node.props.name] = node.value; (node.children || []).filter(c => c && typeof c === 'object').forEach(collect); };
        collect(form); submitted = this;
      }
      append(...pair) { this.extra.push(pair); }
      set(key, value) { this.fields[key] = value; }
    },
    AbortController, setTimeout, clearTimeout,
    fetch: (...args) => { calls++; return fetchImpl(...args); }
  };
  vm.createContext(c); vm.runInContext(functions + '\nthis.build = buildContactForm;', c); current = c.build();
  return { c, goals, get current() { return current; }, get calls() { return calls; }, get submitted() { return submitted; } };
}
for (const lang of ['hy', 'en']) {
  for (const [label, response, success, analyticsThrows] of [
    ['accepted string', { ok: true, json: async () => ({ success: 'true' }) }, true],
    ['accepted boolean', { ok: true, json: async () => ({ success: true }) }, true],
    ['analytics failure after acceptance', { ok: true, json: async () => ({ success: true }) }, true, true],
    ['HTTP error', { ok: false, json: async () => ({ success: true }) }, false],
    ['rejected', { ok: true, json: async () => ({ success: false }) }, false],
    ['malformed JSON', { ok: true, json: async () => { throw Error('Invalid JSON'); } }, false],
    ['network error', null, false]
  ]) {
    let finish;
    const run = setup(lang, () => new Promise((resolve, reject) => { finish = () => response ? resolve(response) : reject(Error('Network')); }), analyticsThrows);
    let form = run.current.children[1];
    assert.equal(form.querySelector('[name="name"]').value, 'TEST ONLY');
    assert.equal(form.querySelector('[name="name"]').props.autocomplete, 'name');
    assert.equal(form.querySelector('[name="phone"]').props.type, 'tel');
    assert.equal(form.querySelector('[name="email"]').required, false);
    const subject = form.querySelector('[name="service"]');
    subject.change('collaboration', 'change');
    assert.equal(run.c.state.service, 'collaboration');
    form.querySelector('[name="contact_method"]').change('whatsapp', 'change');
    const event = { preventDefault() {}, target: form };
    form.props.onsubmit(event); form.props.onsubmit(event);
    assert.equal(run.calls, 1, 'Double submission must be ignored');
    assert.equal(form.querySelector('.form-submit').disabled, true);
    assert.equal(form.querySelector('.form-submit').textContent, content.window.CONTENT[lang].sending);
    assert.equal(form.props['aria-busy'], 'true');
    assert.deepEqual(run.submitted.extra, [['_subject', 'New inquiry from levongalstyan.com'], ['_captcha', 'false']]);
    assert.equal(run.submitted.fields.service, content.window.CONTENT[lang].contactSubjects.collaboration);
    assert.equal(run.submitted.fields.contact_method, 'whatsapp');
    // A viewport or language change can rebuild the form while the request is pending.
    run.c.setState({}); form = run.current.children[1];
    assert.equal(form.querySelector('.form-submit').disabled, true);
    assert.equal(form.querySelector('[name="name"]').value, 'TEST ONLY');
    assert.equal(form.querySelector('[name="service"]').value, 'collaboration');
    assert.equal(form.querySelector('[name="contact_method"]').value, 'whatsapp');
    finish(); await new Promise(resolve => setTimeout(resolve, 0)); form = run.current.children[1];
    assert.equal(Boolean(run.c.state.sent), success, label); assert.equal(run.c.formSending, false);
    assert.equal(form.querySelector('.form-submit').disabled, false); assert.equal(form.props['aria-busy'], 'false');
    assert.equal(run.c.formDraft.name, success ? '' : 'TEST ONLY');
    assert.equal(run.c.formDraft.contact_method, success ? '' : 'whatsapp');
    assert.equal(run.c.state.service, success ? '' : 'collaboration');
    assert.equal(form.querySelector('.form-error').hidden, success);
    assert.equal(run.current.querySelector(success ? '.sent-panel.show' : '.form-error').focused, true);
    assert.deepEqual(run.goals, success ? ['contact_success'] : []);
    console.log('PASS', lang, label);
  }
  const run = setup(lang, async () => { throw Error('Must not send'); });
  run.c.state.service = 'Specific procedure'; run.c.setState({});
  const form = run.current.children[1];
  assert.equal(form.querySelector('[name="service"]').value, 'Specific procedure');
  assert.ok(form.querySelector('[name="service"]').children.some(option => option.props.value === 'Specific procedure'));
  form.valid = false; form.props.onsubmit({ preventDefault() {}, target: form });
  assert.equal(run.calls, 0); assert.equal(run.c.formSending, false);
  console.log('PASS', lang, 'validation and procedure preselection');
  for (const method of ['', 'email', 'whatsapp', 'telegram', 'phone']) {
    const accepted = setup(lang, async () => ({ ok: true, json: async () => ({ success: true }) }));
    const form = accepted.current.children[1];
    form.querySelector('[name="service"]').change('other', 'change');
    form.querySelector('[name="phone"]').change('');
    form.querySelector('[name="contact_method"]').change(method, 'change');
    form.props.onsubmit({ preventDefault() {}, target: form });
    assert.equal(accepted.calls, 0, 'Missing contact details must block delivery');
    const useEmail = !method || method === 'email';
    const field = form.querySelector(useEmail ? '[name="email"]' : '[name="phone"]');
    field.change(useEmail ? 'test@example.invalid' : '+374 00000000');
    assert.equal(form.reportValidity(), true, 'Only the chosen contact channel is needed');
    accepted.c.setState({ lang: lang === 'hy' ? 'en' : 'hy' });
    const rebuilt = accepted.current.children[1];
    assert.equal(rebuilt.querySelector('[name="contact_method"]').value, method);
    assert.equal(rebuilt.querySelector('[name="service"]').value, 'other');
    rebuilt.props.onsubmit({ preventDefault() {}, target: rebuilt });
    assert.equal(accepted.calls, 1);
    assert.equal(accepted.submitted.fields.contact_method, method);
    assert.equal(accepted.submitted.fields.service, content.window.CONTENT[accepted.c.state.lang].contactSubjects.other);
    await new Promise(resolve => setTimeout(resolve, 0));
    console.log('PASS', lang, method || 'email-only with no preference');
  }
  const wrongChannel = setup(lang, async () => { throw Error('Must not send'); });
  const selectedForm = wrongChannel.current.children[1];
  selectedForm.querySelector('[name="contact_method"]').change('email', 'change');
  selectedForm.props.onsubmit({ preventDefault() {}, target: selectedForm });
  assert.equal(wrongChannel.calls, 0, 'A phone number cannot replace a requested email');
  selectedForm.querySelector('[name="email"]').change('test@example.invalid');
  selectedForm.querySelector('[name="phone"]').change('');
  selectedForm.querySelector('[name="contact_method"]').change('telegram', 'change');
  selectedForm.props.onsubmit({ preventDefault() {}, target: selectedForm });
  assert.equal(wrongChannel.calls, 0, 'Email cannot replace the requested messenger contact');
  console.log('PASS', lang, 'preferred channel is required');
}
