import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('dist');
const source = { window: {} };
vm.runInNewContext(fs.readFileSync('js/content.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/patient-resources.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/orthognathic-guide.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/ent-guides.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/oral-surgery-guides.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/oral-guide-refinements.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/aesthetic-guides.js', 'utf8'), source);
vm.runInNewContext(fs.readFileSync('js/aesthetic-guides-hy.js', 'utf8'), source);
assert.deepEqual(
  Array.from(source.window.PATIENT_GUIDES.orthognathic.hy.sections.filter(x => /^Այց [1-5]/.test(x.title)), x => x.title.slice(0, 5)),
  ['Այց 1', 'Այց 2', 'Այց 3', 'Այց 4', 'Այց 5']
);
assert.ok(source.window.PATIENT_GUIDES.orthognathic.hy.contacts.includes('հինգ պլանային այց'));
assert.equal(source.window.PATIENT_GUIDES.septoplasty.en.sections.length, 13);
assert.equal(source.window.PATIENT_GUIDES.septoplasty.hy.sections.length, 13);
assert.equal(source.window.PATIENT_GUIDES.fess.en.sections.length, 22);
assert.equal(source.window.PATIENT_GUIDES.fess.hy.sections.length, 22);
assert.ok(source.window.PATIENT_GUIDES.fess.en.sections.some(x => x.blocks.some(b => b.type === 'video')));
assert.ok(source.window.PATIENT_GUIDES.fess.hy.sections.some(x => x.blocks.some(b => b.type === 'video')));
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.otf':'font/otf', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filename = path.resolve(root, '.' + pathname);
  if (!filename.startsWith(root + path.sep) && filename !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
  if (!fs.existsSync(filename)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
  fs.createReadStream(filename).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const artifacts = '.cache/diagnostics';
fs.mkdirSync(artifacts, { recursive:true });
// Wait for the FAQ transition and its final scroll-position correction.
async function settleFaq(page) {
  await page.locator('#faq').evaluate(faq => new Promise(resolve => {
    const duration = parseFloat(getComputedStyle(faq).getPropertyValue('--faq-motion-ms')) || 0;
    setTimeout(resolve, duration + 100);
  }));
}

async function settleScroll(page) {
  await page.evaluate(() => new Promise((resolve, reject) => {
    let last = scrollY, stableSince = performance.now();
    const started = stableSince;
    function sample(now) {
      if (scrollY !== last) { last = scrollY; stableSince = now; }
      if (now - stableSince >= 150) return resolve();
      if (now - started > 3000) return reject(new Error('Scrolling did not settle'));
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }));
}

const browser=await chromium.launch();
try {
 for(const width of [1440,390]) for(const lang of ['hy','en']) {
  const context=await browser.newContext({viewport:{width,height:1100}});
  await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const page=await context.newPage();
  for(let iteration=0;iteration<3;iteration++) {
      await page.goto(base + lang + '/contact/');
      await page.evaluate(() => document.fonts.ready);
      const contact = page.locator('.contact-form');
      await contact.locator('[name="name"]').fill('Technical test');
      await contact.locator('[name="email"]').fill('test@example.invalid');
      await contact.locator('[name="message"]').fill('Test only — Հայերեն\nNo real submission');
      await contact.evaluate(form => { form.dataset.testIdentity = 'original'; });
      await contact.locator('.form-submit').click();
      await contact.locator('.form-error:not([hidden])').waitFor();
      assert.equal(await contact.getAttribute('data-test-identity'), 'original', 'Sending must keep the existing form DOM');
      assert.equal(await contact.locator('[name="message"]').inputValue(), 'Test only — Հայերեն\nNo real submission');
      assert.ok(await contact.locator('.form-fallback').isVisible());
      await settleScroll(page);
      // Translation changes section heights. Keep the same visible block, including form fields.
      for (const selector of ['#about', '#services', '#faq', '.contact-form [name="message"]', '#insights', '.site-footer']) {
        await page.locator(selector).evaluate(node => window.scrollTo({top:node.getBoundingClientRect().top + scrollY - 90,behavior:'instant'}));
        await settleScroll(page);
        const before = await page.locator(selector).evaluate(node => node.getBoundingClientRect().top);
        await page.locator('.lang-btn').click();
        await page.evaluate(() => document.fonts.ready);
        await settleScroll(page);
        const after = await page.locator(selector).evaluate(node => node.getBoundingClientRect().top);
        console.log(JSON.stringify({lang,width,iteration,selector,before,after}));
        if (selector === '.site-footer') {
          assert.ok(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY < 2), 'Keep the footer in view at the bottom');
        } else {
          assert.ok(Math.abs(after - before) < 3, `Language switch moved ${selector} by ${after - before}px at ${width}px`);
        }
        assert.equal(await contact.locator('[name="message"]').inputValue(), 'Test only — Հայերեն\nNo real submission');
      }
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      console.log('PASS contact error keeps DOM and language keeps viewport:', lang, width);

  }
  await context.close();
 }
} finally {await browser.close();await new Promise(r=>server.close(r));}
