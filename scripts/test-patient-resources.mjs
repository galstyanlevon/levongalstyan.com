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
const artifacts = 'artifacts/patient-resources';
fs.mkdirSync(artifacts, { recursive:true });
let browser;
try {
  browser = await chromium.launch();
  for (const width of [1440, 390]) {
    for (const lang of ['hy', 'en']) {
      const context = await browser.newContext({ viewport:{width, height:1100} });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      // No real messages or external embedded media requests during the checks.
      await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.addInitScript(other => localStorage.setItem('galstyan.lang', other), lang === 'hy' ? 'en' : 'hy');
      await page.goto(base + lang + '/service/3/');
      const links = page.locator('.patient-resource-link');
      assert.equal(await links.count(), 2);
      assert.deepEqual(await page.locator('.sections-col .section-block:not(.patient-resource-link) p').allTextContents(), Array.from(source.window.CONTENT[lang].orthognathicSections, x=>x.body));
      assert.equal(await page.locator('.service-body').first().textContent(), source.window.CONTENT[lang].orthognathicIntro);
      assert.equal(await page.locator('.contact-form').count(), 1);
      assert.equal(await links.locator('svg').count(), 0);
      for (const [kind, index] of [['guide',0],['gallery',1]]) assert.equal(await links.nth(index).getAttribute('href'), base + lang + '/' + kind + '/orthognathic/');
      const layout = await page.evaluate(() => {
        const a = document.querySelector('.patient-resource-link');
        const ordinary = document.querySelector('.section-block:not(.patient-resource-link)');
        return { overflow:document.documentElement.scrollWidth > innerWidth, font:getComputedStyle(a.querySelector('h2')).fontSize, originalFont:getComputedStyle(ordinary.querySelector('h2')).fontSize, left:a.getBoundingClientRect().left, originalLeft:ordinary.getBoundingClientRect().left };
      });
      assert.equal(layout.overflow, false); assert.equal(layout.font, layout.originalFont); assert.equal(layout.left, layout.originalLeft);
      await page.locator('.section-block:not(.patient-resource-link)').last().evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-90));
      await page.screenshot({path:`${artifacts}/service-${lang}-${width}.png`});
      await links.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(base + lang + '/guide/orthognathic/');
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('.guide-recovery-table tbody tr').count(), 6);
      assert.equal(await page.locator('.guide-section').count(), source.window.PATIENT_GUIDES.orthognathic[lang].sections.length);
      const guideURL = page.url();
      await page.locator('.guide-contents a[href="#guide-recovery"]').click();
      assert.equal(page.url(), guideURL);
      assert.equal(await page.evaluate(()=>document.activeElement.id), 'guide-recovery');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({path:`${artifacts}/recovery-${lang}-${width}.png`});
      const other = lang === 'hy' ? 'en' : 'hy';
      await page.locator('.lang-btn').click();
      await page.waitForURL(base + other + '/guide/orthognathic/');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('lang'), other);
      await page.locator('.service-hero .back-link').click();
      await page.waitForURL(base + other + '/service/3/');
      await page.locator('.patient-resource-link').nth(1).click();
      await page.waitForURL(base + other + '/gallery/orthognathic/');
      assert.ok((await page.locator('.sections-col').textContent()).includes(source.window.RESOURCE_LABELS[other].emptyGallery));
      assert.equal(await page.locator('.patient-photo-case').count(), 0);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
      await page.goto(base + lang + '/procedure/rhinoplasty/');
      assert.equal(await page.locator('.patient-resource-link').count(), 1);
      assert.equal(await page.locator('.patient-resource-link').getAttribute('href'), base+lang+'/gallery/rhinoplasty/');
      assert.equal(await page.locator('.contact-form').count(), 1);
      await page.goto(base + lang + '/service/2/');
      assert.equal(await page.locator('.patient-resource-link').count(), 0);
      assert.deepEqual(errors, []);
      console.log(`PASS ${lang}, ${width}px: source content, layout, keyboard, locale routes, guide contents, recovery, galleries and form presence`);
      await context.close();
    }
  }
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
