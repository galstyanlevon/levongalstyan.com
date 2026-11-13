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

const browser=await chromium.launch();
try {
for(const method of ['locator','mouse']) for(const width of [1440,390]) for(const lang of ['hy','en']) {
 const context=await browser.newContext({viewport:{width,height:1100}});
 await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 const page=await context.newPage();
 await page.addInitScript(()=>{
  window.trace=[];
  for(const event of ['pointerdown','mousedown','focusin','mouseup','click']) document.addEventListener(event,e=>window.trace.push({event,tag:e.target.tagName,cls:e.target.className,y:scrollY,about:document.querySelector('#about')?.getBoundingClientRect().top}),true);
  const orig=window.scrollTo;
  window.scrollTo=function(...args){const result=orig.apply(this,args);window.trace.push({method:'scrollTo',args,y:scrollY,about:document.querySelector('#about')?.getBoundingClientRect().top});return result;};
 });
 for(let i=0;i<3;i++) {
  await page.goto(base+lang+'/contact/');await page.evaluate(()=>document.fonts.ready);
  const form=page.locator('.contact-form');
  await form.locator('[name=name]').fill('Technical test');
  await form.locator('[name=email]').fill('test@example.invalid');
  await form.locator('[name=message]').fill('Test only');
  await form.locator('.form-submit').click();
  await form.locator('.form-error:not([hidden])').waitFor();
  await page.locator('#about').evaluate(n=>window.scrollTo({top:n.getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
  await page.evaluate(()=>window.trace=[]);
  const before=await page.locator('#about').evaluate(n=>n.getBoundingClientRect().top);
  if(method==='locator') await page.locator('.lang-btn').click();
  else {
    const rect=await page.locator('.lang-btn').boundingBox();
    await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
  }
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(400);
  const after=await page.locator('#about').evaluate(n=>n.getBoundingClientRect().top);
  console.log(JSON.stringify({method,lang,width,i,before,after,trace:await page.evaluate(()=>window.trace)}));
 }
 await context.close();
}
} finally {await browser.close();await new Promise(r=>server.close(r));}
