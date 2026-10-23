import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('js/app.js', 'utf8');
const functions = source.slice(source.indexOf('  function serviceOptionsList('), source.indexOf('  function buildContact()'));
const content = { window: {} };
vm.runInNewContext(fs.readFileSync('js/content.js', 'utf8'), content);
function el(tag, props = {}, children = []) {
  props ||= {};
  return {
    tag, props, children, value: '', disabled: false, hidden: props.hidden != null,
    appendChild(child) { this.children.push(child); }, addEventListener() {},
    setAttribute(key, value) { this.props[key] = value; }, focus() { this.focused = true; },
    reportValidity() { return this.valid !== false; },
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
    el, state: { lang, service: '' }, formDraft: { name: 'TEST ONLY', phone: '+374 00000000', email: '', message: 'TEST ONLY' }, formSending: false, formError: false,
    window: { SiteAnalytics: { goal: id => { goals.push(id); if (analyticsThrows) throw Error('Analytics unavailable'); } } },
    t: () => content.window.CONTENT[c.state.lang], document: { querySelector: selector => current.querySelector(selector) },
    setState: patch => { Object.assign(c.state, patch); current = c.build(); },
    FormData: class { constructor(form) { this.form = form; this.extra = []; submitted = this; } append(...pair) { this.extra.push(pair); } },
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
    assert.equal(form.querySelector('[name="email"]').props.required, undefined);
    const select = form.querySelector('[name="service"]');
    assert.equal(select.children[0].props.value, '');
    const service = content.window.CONTENT[lang].services[2].title.replace(/\n/g, ' ');
    select.props.onchange({ target: { value: service } }); assert.equal(run.c.state.service, service);
    const event = { preventDefault() {}, target: form };
    form.props.onsubmit(event); form.props.onsubmit(event);
    assert.equal(run.calls, 1, 'Double submission must be ignored');
    assert.equal(form.querySelector('.form-submit').disabled, true);
    assert.equal(form.querySelector('.form-submit').textContent, content.window.CONTENT[lang].sending);
    assert.equal(form.props['aria-busy'], 'true');
    assert.deepEqual(run.submitted.extra, [['_subject', 'New inquiry from levongalstyan.com'], ['_captcha', 'false']]);
    // A viewport or language change can rebuild the form while the request is pending.
    run.c.setState({}); form = run.current.children[1];
    assert.equal(form.querySelector('.form-submit').disabled, true);
    assert.equal(form.querySelector('[name="name"]').value, 'TEST ONLY');
    finish(); await new Promise(resolve => setTimeout(resolve, 0)); form = run.current.children[1];
    assert.equal(Boolean(run.c.state.sent), success, label); assert.equal(run.c.formSending, false);
    assert.equal(form.querySelector('.form-submit').disabled, false); assert.equal(form.props['aria-busy'], 'false');
    assert.equal(run.c.formDraft.name, success ? '' : 'TEST ONLY');
    assert.equal(form.querySelector('.form-error').hidden, success);
    assert.equal(run.current.querySelector(success ? '.sent-panel.show' : '.form-error').focused, true);
    assert.deepEqual(run.goals, success ? ['contact_success'] : []);
    console.log('PASS', lang, label);
  }
  const run = setup(lang, async () => { throw Error('Must not send'); });
  run.c.state.service = 'Specific procedure'; run.c.setState({});
  const form = run.current.children[1];
  assert.ok(form.querySelector('[name="service"]').children.some(option => option.props.value === run.c.state.service && option.props.selected));
  form.valid = false; form.props.onsubmit({ preventDefault() {}, target: form });
  assert.equal(run.calls, 0); assert.equal(run.c.formSending, false);
  console.log('PASS', lang, 'validation and procedure preselection');
}
