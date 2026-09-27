import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/analytics.js', 'utf8');
function run(host, path, decision = null, id = 12345678) {
  const calls = [], scripts = [], storage = new Map();
  if (decision) storage.set('galstyan.analytics-consent.v1', decision);
  function element(tag) {
    return {
      tag, children: [], dataset: {}, hidden: false,
      appendChild(child) { this.children.push(child); },
      addEventListener(name, fn) { this[name] = fn; },
      querySelector(selector) {
        if (selector === 'p') return this.children.find(child => child.tag === 'p');
        if (selector === 'button') return this.children.find(child => child.tag === 'button');
        return this.children.find(child => child.dataset.choice === selector.match(/"(.*?)"/)?.[1]);
      },
      setAttribute() {}, focus() {}, remove() {}
    };
  }
  const document = {
    readyState: 'complete', referrer: 'https://example.org/patient?email=private@example.org',
    documentElement: { lang: 'hy' }, body: element('body'),
    head: { appendChild(script) { scripts.push(script); } }, createElement: element
  };
  const location = { hostname: host, pathname: path, search: '?name=Patient&diagnosis=private', hash: '#secret', origin: 'https://' + host };
  const window = { SHARE_PAGES: [
    { path: 'hy/' }, { path: 'en/' }, { path: 'hy/contact/' }, { path: 'en/contact/' },
    { path: 'hy/service/2/' }, { path: 'en/service/2/' },
    { path: 'hy/guide/sinus-lift/' }, { path: 'en/guide/sinus-lift/' }
  ], ym(...args) { calls.push(args); } };
  const context = { window, document, location, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, val) => storage.set(key, val) }, URL, Date, Number, Array };
  vm.runInNewContext(source.replace('var COUNTER_ID = 98511055;', `var COUNTER_ID = ${id};`), context);
  return { window, document, location, calls, scripts, storage };
}

const pre = run('www.levongalstyan.com', '/hy/');
assert.equal(pre.scripts.length, 0, 'no script before consent');
assert.equal(pre.calls.length, 0, 'no calls before consent');
pre.document.body.children[0].querySelector('[data-choice="reject"]').click();
assert.equal(pre.scripts.length, 0, 'decline never loads script');
pre.window.SiteAnalytics.openSettings();
pre.document.body.children[0].querySelector('[data-choice="accept"]').click();
assert.equal(pre.scripts.length, 1, 'consent loads one script');
pre.scripts[0].onload();
assert.deepEqual(pre.calls.map(c => c[1]), ['init', 'hit']);
assert.equal(pre.calls[1][2], 'https://www.levongalstyan.com/hy/');
assert.equal(pre.calls[1][3].referer, 'https://example.org/');
pre.window.SiteAnalytics.pageView();
assert.equal(pre.calls.length, 2, 'render without navigation does not repeat a hit');
pre.location.pathname = '/hy/service/2/';
pre.window.SiteAnalytics.pageView();
pre.location.pathname = '/hy/contact/';
pre.window.SiteAnalytics.pageView();
pre.window.SiteAnalytics.goal('contact_success');
assert.deepEqual(pre.calls.slice(2).map(c => [c[1], c[2]]), [
  ['hit', 'https://www.levongalstyan.com/hy/service/2/'],
  ['hit', 'https://www.levongalstyan.com/hy/contact/'],
  ['reachGoal', 'contact_open'], ['reachGoal', 'contact_success']
]);
assert(!JSON.stringify(pre.calls).includes('private@example.org'));
assert(!JSON.stringify(pre.calls).includes('diagnosis=private'));
for (const path of ['/hy/guide/sinus-lift/', '/en/', '/en/service/2/', '/en/guide/sinus-lift/', '/en/contact/']) {
  pre.location.pathname = path;
  pre.document.documentElement.lang = 'en';
  pre.window.SiteAnalytics.pageView();
}
assert.equal(pre.calls.filter(c => c[1] === 'hit').length, 8, 'both languages and page types');
assert.equal(pre.calls.filter(c => c[1] === 'reachGoal' && c[2] === 'contact_open').length, 2);
pre.document.body.children[0].querySelector('[data-choice="reject"]').click();
pre.window.SiteAnalytics.goal('contact_success');
assert.equal(pre.calls.at(-1)[1], 'destruct', 'withdrawal stops goals');
for (const path of ['/preview/share/hy/', '/preview/', '/hy/secret/']) {
  const blocked = run('www.levongalstyan.com', path, 'accept');
  assert.equal(blocked.scripts.length, path.startsWith('/preview/') ? 0 : 1);
  if (blocked.scripts.length) { blocked.scripts[0].onload(); assert.equal(blocked.calls.filter(c => c[1] === 'hit').length, 0); }
}
for (const host of ['localhost', 'preview.example.org', 'levongalstyan.com']) {
  assert.equal(run(host, '/hy/', 'accept').scripts.length, 0);
}
assert.equal(run('www.levongalstyan.com', '/en/', 'accept', null).scripts.length, 0, 'missing ID cannot activate');
console.log('PASS consent, isolated host and preview, sanitized SPA hits, deduplication, goals, withdrawal');
