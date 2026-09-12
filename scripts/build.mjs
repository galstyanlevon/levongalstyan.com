import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const out = process.env.OUT_DIR || 'dist';
const site = (process.env.SITE_URL || 'https://www.levongalstyan.com').replace(/\/$/, '') + '/';
const canonical = 'https://www.levongalstyan.com/';
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('js/content.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('js/patient-resources.js', 'utf8'), context);
const { CONTENT, LECTURES, PATIENT_LINKS } = context.window;
const pages = [];
const homeMeta = {
  en: {
    title: 'Dr. Levon Galstyan — Oral & Maxillofacial Surgeon',
    description: 'Advanced maxillofacial, reconstructive and facial surgery in Yerevan, combining precise digital planning with individualized care.',
    image: 'images/social-preview-en.jpg'
  },
  hy: {
    title: 'Լևոն Գալստյան — դիմածնոտային վիրաբույժ',
    description: 'Դիմածնոտային, վերականգնողական և էսթետիկ վիրաբուժություն Երևանում՝ ժամանակակից թվային պլանավորմամբ և անհատական մոտեցմամբ։',
    image: 'images/social-preview-hy.jpg'
  }
};
for (const lang of ['en', 'hy']) {
  const t = CONTENT[lang];
  const add = (route, slug, title, description, image = 'images/hero.webp') => pages.push({ lang, route, path: `${lang}/${slug ? slug + '/' : ''}`, title: String(title).replace(/\s+/g, ' '), description: String(description || t.heroRole).replace(/\s+/g, ' ').slice(0, 240), image });
  add('#home', '', homeMeta[lang].title, homeMeta[lang].description, homeMeta[lang].image);
  for (const [anchor, title] of Object.entries({about:t.approachTitle,services:t.servicesTitle,credentials:t.credentialsTitle || 'Credentials',patients:t.forPatientsTitle,faq:t.faqTitle,contact:t.scheduleTitle,insights:t.insightsTitle})) add('#'+anchor, anchor, title || anchor, t.heroRole);
  for (const key of ['bio','education','experience']) add('#/'+key,key,t[key+'Title']);
  add('#/activity','activity',t.insightsTitle,t.insightsBody);
  t.services.forEach((s,i)=>add('#/service/'+i,'service/'+i,s.title,s.body));
  const resources = context.window.RESOURCE_LABELS[lang];
  for (const [key, guide] of Object.entries(context.window.PATIENT_GUIDES)) {
    if (!guide[lang]) continue;
    add('#/guide/'+key, 'guide/'+key, guide[lang].title+' — '+resources.guide, guide[lang].subtitle);
    pages[pages.length-1].draft = guide.status === 'draft';
  }
  for (const [key, gallery] of Object.entries(context.window.PATIENT_GALLERIES)) {
    const procedure = gallery.sub ? t.subServices[gallery.sub].title : t.services[gallery.service].title;
    add('#/gallery/'+key, 'gallery/'+key, procedure+' — '+resources.gallery, resources.galleryBody);
    pages[pages.length-1].draft = gallery.status === 'draft';
  }
  for (const [key,s] of Object.entries(t.subServices)) add('#/sub/'+key,'procedure/'+key,s.title,s.intro);
  for (const [key,s] of Object.entries(t.insightPages)) add('#/insight/'+key,'insight/'+key,s.title,s.intro);
  PATIENT_LINKS[lang].filter(p=>p.key!=='faq').forEach(p=>add('#/patients/'+p.key,'patients/'+p.key,p.label));
  LECTURES[lang].forEach(l=>add('#/lecture/'+l.id,'lecture/'+l.id,l.title,l.body));
}
fs.mkdirSync(out,{recursive:true});
for (const dir of ['css','js','fonts','images']) fs.cpSync(dir,path.join(out,dir),{recursive:true});
fs.copyFileSync('favicon.svg',path.join(out,'favicon.svg'));
fs.copyFileSync('CNAME',path.join(out,'CNAME'));
const esc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template = fs.readFileSync('index.html','utf8');
function html(p, root=false) {
  const base = root ? './' : '../'.repeat(p.path.split('/').filter(Boolean).length);
  const url = site+(root?'':p.path), canon=canonical+(root?'':p.path);
  const image = site + p.image;
  const tags = `<base href="${base}">\n<link rel="canonical" href="${esc(canon)}">\n<meta name="description" content="${esc(p.description)}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Dr. Levon Galstyan">\n<meta property="og:title" content="${esc(p.title)}">\n<meta property="og:description" content="${esc(p.description)}">\n<meta property="og:url" content="${esc(url)}">\n<meta property="og:image" content="${esc(image)}">\n<meta property="og:image:type" content="image/jpeg">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${esc(p.title)}">\n<meta property="og:locale" content="${p.lang==='hy'?'hy_AM':'en_US'}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(p.title)}">\n<meta name="twitter:description" content="${esc(p.description)}">\n<meta name="twitter:image" content="${esc(image)}">`;
  const reviewMeta = p.draft ? '\n<meta name="robots" content="noindex, nofollow">' : '';
  return template.replace('<html lang="en">',`<html lang="${p.lang}" data-page-lang="${root?'':p.lang}">`).replace(/<title>.*?<\/title>/,`<title>${esc(p.title)} — Dr. Levon Galstyan</title>\n${tags}${reviewMeta}`);
}
fs.writeFileSync(path.join(out,'js/share-pages.js'),'window.SHARE_PAGES = '+JSON.stringify(pages)+';\n');
fs.writeFileSync(path.join(out,'index.html'),html(pages.find(p=>p.lang==='hy' && p.route==='#home'),true));
for(const p of pages){const dir=path.join(out,p.path);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html(p));}
// Metadata must be readable by crawlers without executing JavaScript.
for(const p of pages){const text=fs.readFileSync(path.join(out,p.path,'index.html'),'utf8');if(!text.includes('content="'+esc(p.title)+'"')||!text.includes(canonical+p.path))throw Error('Invalid metadata: '+p.path);}
if(new Set(pages.map(p=>p.path)).size!==pages.length)throw Error('Duplicate paths');
console.log(`Built and validated ${pages.length + 1} static HTML pages in ${out}`);
