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
      await page.addInitScript(other => { try { localStorage.setItem('galstyan.lang', other); } catch {} }, lang === 'hy' ? 'en' : 'hy');
      await page.goto(base + lang + '/service/3/');
      const links = page.locator('.patient-resource-link');
      assert.equal(await links.count(), 1);
      assert.deepEqual(await page.locator('.sections-col .section-block:not(.patient-resource-link) p').allTextContents(), Array.from(source.window.CONTENT[lang].orthognathicSections, x=>x.body));
      assert.equal(await page.locator('.service-body').first().textContent(), source.window.CONTENT[lang].orthognathicIntro);
      assert.equal(await page.locator('.contact-form').count(), 1);
      assert.equal(await links.locator('svg').count(), 0);
      assert.equal(await links.first().getAttribute('href'), null);
      assert.equal(await links.first().locator('h2 a').count(), 0);
      assert.equal(await links.first().locator('p a').textContent(), source.window.RESOURCE_LABELS[lang].guideBody);
      assert.equal(await links.first().locator('p a').getAttribute('href'), base + lang + '/guide/orthognathic/');
      const layout = await page.evaluate(() => {
        const a = document.querySelector('.patient-resource-link');
        const ordinary = document.querySelector('.section-block:not(.patient-resource-link)');
        return { overflow:document.documentElement.scrollWidth > innerWidth, font:getComputedStyle(a.querySelector('h2')).fontSize, originalFont:getComputedStyle(ordinary.querySelector('h2')).fontSize, left:a.getBoundingClientRect().left, originalLeft:ordinary.getBoundingClientRect().left };
      });
      assert.equal(layout.overflow, false); assert.equal(layout.font, layout.originalFont); assert.equal(layout.left, layout.originalLeft);
      await page.locator('.section-block:not(.patient-resource-link)').last().evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-90));
      await page.screenshot({path:`${artifacts}/service-${lang}-${width}.png`});
      await links.first().locator('p a').focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(base + lang + '/guide/orthognathic/');
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('.service-hero .back-link').textContent(), source.window.RESOURCE_LABELS[lang].back);
      assert.equal(await page.locator('.service-hero .back-link').textContent(), lang === 'hy' ? 'Վերադառնալ ծառայության էջին' : 'Back to service');
      assert.equal(await page.locator('.guide-recovery-table tbody tr').count(), 7);
      assert.equal(await page.locator('.guide-section').count(), source.window.PATIENT_GUIDES.orthognathic[lang].sections.length);
      assert.equal(await page.locator('.guide-section-level-1').count(), 3);
      assert.equal(await page.locator('.guide-section-level-2').count(), 13);
      assert.equal(await page.locator('.guide-reference-list li').count(), 5);
      assert.equal(await page.locator('.guide-writing-line').count(), 0);
      assert.equal(await page.locator('.guide-route h2').textContent(), source.window.PATIENT_GUIDES.orthognathic[lang].routeTitle);
      assert.equal(await page.locator('.guide-pathway li').count(), 5);
      assert.equal(await page.locator('.guide-pathway-arrow').count(), 4);
      assert.equal(await page.locator('.guide-contents').count(), 0);
      const footerColours = await page.locator('.site-footer').evaluate(e => ({
        heading: getComputedStyle(e.querySelector('.footer-col p')).color,
        link: getComputedStyle(e.querySelector('.footer-col a')).color
      }));
      assert.deepEqual(footerColours, { heading:'rgb(238, 249, 247)', link:'rgb(238, 249, 247)' });
      assert.equal(await page.getByText(source.window.RESOURCE_LABELS[lang].bibliography, { exact:true }).count(), 1);
      if (lang === 'en') assert.equal(source.window.RESOURCE_LABELS[lang].bibliography, 'References');
      assert.equal(await page.locator('.guide-bibliography-list li').count(), 4);
      assert.equal(await page.locator('.guide-bibliography-list a').count(), 2);
      assert.equal(await page.locator('.patient-guide + .section-peach .contact-form').count(), 0);
      const paper = await page.locator('.patient-guide > div').evaluate(e => {
        const s = getComputedStyle(e); return { background:s.backgroundColor, border:s.borderTopWidth, borderColor:s.borderTopColor, radius:s.borderRadius };
      });
      assert.equal(paper.background, 'rgb(250, 250, 250)');
      assert.equal(paper.border, '1px');
      assert.equal(paper.borderColor, 'rgba(39, 42, 60, 0.28)');
      assert.equal(paper.radius, '0px');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({path:`${artifacts}/recovery-${lang}-${width}.png`});
      const other = lang === 'hy' ? 'en' : 'hy';
      await page.locator('.lang-btn').click();
      await page.waitForURL(base + other + '/guide/orthognathic/');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('lang'), other);
      await page.locator('.service-hero .back-link').click();
      await page.waitForURL(base + other + '/service/3/');
      assert.equal(await page.locator('.patient-resource-link').count(), 1);
      assert.equal((await page.goto(base + other + '/gallery/orthognathic/')).status(), 404);
      for (const entry of [{ service:4, key:'septoplasty' }, { service:5, key:'fess' }]) {
        await page.goto(base + lang + '/service/' + entry.service + '/');
        const resource = page.locator('.patient-resource-link');
        assert.equal(await resource.count(), 1);
        assert.equal(await resource.locator('p a').getAttribute('href'), base + lang + '/guide/' + entry.key + '/');
        assert.equal(await page.locator('.contact-form').count(), 1);
        await resource.locator('p a').click();
        await page.waitForURL(base + lang + '/guide/' + entry.key + '/');
        assert.equal(await page.locator('.guide-section').count(), source.window.PATIENT_GUIDES[entry.key][lang].sections.length);
        assert.equal(await page.locator('.guide-route h2').textContent(), source.window.PATIENT_GUIDES[entry.key][lang].routeTitle);
        assert.equal(await page.locator('.guide-pathway li').count(), 5);
        assert.equal(await page.locator('.guide-pathway-arrow').count(), 4);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth), false);
        if (entry.key === 'septoplasty') {
          assert.equal(await page.locator('.guide-recovery-table tbody tr').count(), 4);
          assert.equal(await page.locator('.guide-timeline > div').count(), 7);
        } else {
          assert.equal(await page.locator('.guide-list').count() > 0, true);
          assert.equal(await page.locator('.guide-video iframe').count(), 1);
        }
        assert.equal(await page.getByText(source.window.RESOURCE_LABELS[lang].bibliography, { exact:true }).count(), 1);
        assert.equal(await page.locator('.guide-bibliography-list li').count(), 2);
        assert.equal(await page.locator('.guide-bibliography-list a').count(), 2);
        await page.screenshot({path:`${artifacts}/${entry.key}-${lang}-${width}.png`, fullPage:entry.key === 'septoplasty'});
      }
      await page.goto(base + lang + '/service/2/');
      assert.equal(await page.locator('.patient-resource-link').count(), 1);
      assert.equal(await page.locator('.patient-resource-link p a').getAttribute('href'), base + lang + '/guide/dental-implantation/');
      for (const entry of [{ procedure:'gbr', key:'gbr' }, { procedure:'sinuslifting', key:'sinus-lift' }]) {
        await page.goto(base + lang + '/procedure/' + entry.procedure + '/');
        assert.equal(await page.locator('.patient-resource-link').count(), 1);
        assert.equal(await page.locator('.patient-resource-link p a').getAttribute('href'), base + lang + '/guide/' + entry.key + '/');
        await page.locator('.patient-resource-link p a').click();
        await page.waitForURL(base + lang + '/guide/' + entry.key + '/');
        assert.equal(await page.locator('.guide-section').count(), source.window.PATIENT_GUIDES[entry.key][lang].sections.length);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth), false);
      }
      await page.goto(base + lang + '/faq/');
      const faqCategory = page.locator('.faq-head').first();
      await faqCategory.click();
      const faqQuestions = page.locator('.faq-sub-list').first().locator('.faq-q');
      const expectedFaqGuides = ['tooth-extraction','dental-implantation','impacted-tooth','sinus-lift','fess','septoplasty'];
      for (let i = 0; i < expectedFaqGuides.length; i++) {
        await faqQuestions.nth(i + 1).scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => scrollY);
        await faqQuestions.nth(i + 1).click();
        assert.equal(await page.evaluate(() => scrollY), before);
        assert.equal(await page.locator('.faq-answer.open .faq-guide-link').getAttribute('href'), base + lang + '/guide/' + expectedFaqGuides[i] + '/');
      }
      await page.goto(base + lang + '/procedure/rhinoplasty/');
      assert.equal(await page.locator('.patient-resource-link').count(), 0);
      assert.equal(await page.locator('.contact-form').count(), 1);
      await page.goto(base + lang + '/service/2/');
      assert.equal(await page.locator('.patient-resource-link').count(), 1);
      assert.deepEqual(errors, []);
      console.log(`PASS ${lang}, ${width}px: source content, layout, keyboard, locale routes, guide contents, recovery, galleries and form presence`);
      await context.close();
    }
  }
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
