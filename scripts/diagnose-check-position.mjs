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

const browser = await chromium.launch();
try {
  for (const mutation of [false, true]) for (const width of [1440,390]) for (const lang of ['hy','en']) {
    const context = await browser.newContext({viewport:{width,height:1100}});
    await context.route('**/*', async route => {
      const url=route.request().url();
      if (!url.startsWith(base)) return route.abort();
      if (mutation && new URL(url).pathname.endsWith('/js/app.js')) {
        const original=fs.readFileSync('dist/js/app.js','utf8');
        const changed=original.replace('if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: "instant" });','/* diagnostic mutation: position correction disabled */');
        assert.notEqual(original,changed);
        return route.fulfill({status:200,contentType:'text/javascript',body:changed});
      }
      return route.continue();
    });
    const page = await context.newPage();
    let failure;
    try {
      await page.goto(base + lang + '/faq/');
      const faqCategory = page.locator('.faq-head').first();
      await faqCategory.click();
      await settleFaq(page);
      const faqQuestions = page.locator('.faq-sub-list').first().locator('.faq-q');
      const expectedFaqGuides = ['tooth-extraction','dental-implantation','impacted-tooth','sinus-lift','fess','septoplasty','rhinoplasty','blepharoplasty'];
      for (let i = 0; i < expectedFaqGuides.length; i++) {
        const question = faqQuestions.nth(i + 1);
        await question.scrollIntoViewIfNeeded();
        const before = await question.evaluate(node => node.getBoundingClientRect().top);
        await question.click();
        await settleFaq(page);
        const after = await question.evaluate(node => node.getBoundingClientRect().top);
        // Collapsing a preceding answer changes scrollY to hold the clicked question in place.
        // Measure the visible question, retaining the original 1px rounding allowance.
        assert.ok(Math.abs(after - before) <= 1, `FAQ question ${i + 1} moved by ${after - before}px (${lang}, ${width}px)`);
        assert.equal(await page.locator('.faq-answer.open .faq-guide-link').getAttribute('href'), base + lang + '/guide/' + expectedFaqGuides[i] + '/');
      }

    } catch (error) { failure=error; }
    if (mutation) {
      assert.match(failure?.message || '', /FAQ question [0-9]+ moved/, 'The FAQ check must reject a real position regression');
      console.log('PASS regression detected:', lang, width, failure.message);
    } else {
      if(failure) throw failure;
      console.log('PASS stable FAQ position and all eight links:', lang, width);
    }
    await context.close();
  }
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
