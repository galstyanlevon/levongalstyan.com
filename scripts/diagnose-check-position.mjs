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

const browser = await chromium.launch();
const settle = page => page.evaluate(async () => {
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 400));
});
try {
for (const width of [1440, 390]) for (const lang of ['en', 'hy']) {
  const context = await browser.newContext({viewport:{width,height:1100}});
  await context.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.trace=[];
    for (const method of ['scrollTo','scrollBy']) {
      const original=window[method];
      window[method]=function(...args) { const result=original.apply(this,args); window.trace.push({method,args,y:scrollY,about:document.querySelector('#about')?.getBoundingClientRect().top}); return result; };
    }
    document.addEventListener('click', e => {if(e.target.closest('.lang-btn')) window.trace.push({click:true,y:scrollY,about:document.querySelector('#about')?.getBoundingClientRect().top,fonts:document.fonts.status});}, true);
  });
  for(let iteration=0;iteration<3;iteration++) {
    await page.goto(base+lang+'/contact/');
    await page.evaluate(() => document.fonts.ready);
    const contact=page.locator('.contact-form');
    await contact.locator('[name=name]').fill('Technical test');
    await contact.locator('[name=email]').fill('test@example.invalid');
    await contact.locator('[name=message]').fill('Test only — Հայերեն\nNo real submission');
    await contact.locator('.form-submit').click();
    await contact.locator('.form-error:not([hidden])').waitFor();
    for (const selector of ['#about','#services','#faq','.contact-form [name=message]','#insights','.site-footer']) {
      await page.locator(selector).evaluate(n=>window.scrollTo({top:n.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
      const before=await page.locator(selector).evaluate(n=>n.getBoundingClientRect().top);
      await page.evaluate(()=>window.trace=[]);
      await page.locator('.lang-btn').click();
      await page.evaluate(()=>document.fonts.ready);
      const immediate=await page.locator(selector).evaluate(n=>n.getBoundingClientRect().top);
      await settle(page);
      const after=await page.locator(selector).evaluate(n=>n.getBoundingClientRect().top);
      console.log(JSON.stringify({kind:'language',lang,width,iteration,selector,before,immediate,after,trace:await page.evaluate(()=>window.trace)}));
    }
  }
  await page.goto(base+lang+'/faq/');
  await settle(page);
  await page.locator('.faq-head').first().click();
  await settle(page);
  const questions=page.locator('.faq-sub-list').first().locator('.faq-q');
  for(let i=1;i<=8;i++) {
    const q=questions.nth(i);
    await q.scrollIntoViewIfNeeded();
    const before=await q.evaluate(n=>({top:n.getBoundingClientRect().top,y:scrollY}));
    await page.evaluate(()=>window.trace=[]);
    await q.click();
    const immediate=await q.evaluate(n=>({top:n.getBoundingClientRect().top,y:scrollY}));
    await settle(page);
    const after=await q.evaluate(n=>({top:n.getBoundingClientRect().top,y:scrollY}));
    console.log(JSON.stringify({kind:'faq',lang,width,i,before,immediate,after}));
  }
  await context.close();
}
} finally {await browser.close(); await new Promise(r=>server.close(r));}
