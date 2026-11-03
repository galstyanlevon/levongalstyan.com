import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('dist');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg' };
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
fs.mkdirSync('artifacts/patient-resources', {recursive:true});
let browser;
try {
  browser = await chromium.launch({headless:true});
  for (const lang of ['hy', 'en']) for (const width of [390, 1440]) {
    const context = await browser.newContext({viewport:{width,height:850}});
    const page = await context.newPage();
    let mode = 'server', requests = 0, payload;
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Every external request is intercepted: no email or patient data leaves this test.
    await page.route('**/*', async route => {
      if (route.request().url().startsWith(base)) return route.continue();
      if (!route.request().url().startsWith('https://formsubmit.co/ajax/')) return route.abort();
      requests++; payload = route.request().postData();
      if (mode === 'network') return route.abort('failed');
      if (mode === 'server') return route.fulfill({status:522,contentType:'text/html',body:'Connection timed out'});
      if (mode === 'invalid') return route.fulfill({status:200,contentType:'text/html',body:'Unavailable'});
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success: mode === 'reject' ? 'false' : 'true'})});
    });
    await page.goto(`${base}/${lang}/patients/notes/`);
    await page.locator('.pn-contribute button').click();
    await page.locator('.pn-choice').nth(1).click();
    const note = ('Technical test — do not publish. Հայերեն & <text>\n').repeat(55);
    await page.locator('textarea').fill(note);
    await page.reload();
    await page.locator('.pn-contribute button').click();
    await page.locator('.pn-choice').nth(1).click();
    assert.equal(await page.locator('textarea').inputValue(), note);
    await page.locator('.pn-flow button[type=submit]').click();
    assert.equal(await page.locator('input[type=checkbox]').isChecked(), false);
    await page.locator('input[value=first]').check();
    await page.locator('input[autocomplete=given-name]').fill('Technical Test');
    await page.locator('input[type=checkbox]').check();
    await page.locator('.pn-flow button[type=submit]').click();
    const submit = page.locator('.pn-flow button[type=submit]');
    for (const failure of ['server', 'network', 'invalid', 'reject']) {
      mode = failure;
      await submit.click();
      await page.locator('.pn-fallback:not([hidden])').waitFor();
      assert.equal(await page.locator('.pn-sheet').getAttribute('data-step'), 'review');
      assert.equal(await page.locator('.pn-review').textContent(), note.trim());
      assert.equal(await submit.isEnabled(), true);
      const mail = new URL(await page.locator('.pn-fallback a').getAttribute('href'));
      assert.equal(mail.pathname, 'galstyan.levon@gmail.com');
      assert.equal(mail.searchParams.get('subject'), 'New Patient Note — Review Required');
      assert.ok(mail.searchParams.get('body').includes('Note: ' + note.trim()));
      assert.ok(mail.searchParams.get('body').includes('Publication name: Technical Test'));
      assert.ok(mail.searchParams.get('body').includes('Consent recorded at (UTC):'));
      assert.ok(mail.searchParams.get('body').includes('Status: Awaiting moderation'));
      assert.ok(payload.includes('Agreed publication wording'));
    }
    // Clipboard failure still provides the complete message for manual copying.
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {value:{writeText:async()=>{throw Error('Denied');}},configurable:true}));
    await page.locator('.pn-fallback button').click();
    assert.ok((await page.locator('.pn-fallback textarea').inputValue()).includes(note.trim()));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({path:`artifacts/patient-resources/note-recovery-${lang}-${width}.png`});
    assert.equal(requests, 4); // No automatic retry or fallback transmission.
    mode = 'success';
    await submit.click();
    await page.locator('.pn-sheet[data-step=done]').waitFor();
    assert.equal(await page.evaluate(l => sessionStorage.getItem('patient-note-text-' + l), lang), null);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS recovery, fallback, consent, retry and clearing:',lang,width);
  }
  // Storage may be unavailable; never claim a draft is safely stored in that case.
  const context = await browser.newContext();
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw Error('Disabled'); }; });
  await page.goto(`${base}/en/patients/notes/`);
  await page.locator('.pn-contribute button').click();
  await page.locator('.pn-choice').nth(1).click();
  await page.locator('textarea').fill('Technical test');
  assert.ok((await page.locator('.pn-sheet').textContent()).includes('cannot save this draft'));
  await context.close();
} finally { if (browser) await browser.close(); server.close(); }
