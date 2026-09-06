import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('dist/js/share-pages.js','utf8'),context);
const pages=context.window.SHARE_PAGES;
const base='https://galstyanlevon.github.io/levongalstyan.com/preview/share/';
for (const p of pages) {
  const filename=path.join('dist',p.path,'index.html');
  const html=fs.readFileSync(filename,'utf8');
  const relativeBase=/<base href="([^"]+)"/.exec(html)[1];
  assert.equal(new URL(relativeBase,new URL(p.path,base)).href,base);
  for(const [,src] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(src.startsWith('http')||src===relativeBase)continue;
    assert.ok(fs.existsSync(path.join('dist',src)),`${filename}: ${src}`);
  }
  assert.ok(!html.includes('undefined'));
}
let location=new URL(base);
const dom={baseURI:base,documentElement:{lang:'hy'},addEventListener(){},querySelector(){return null}};
const sandbox={window:context.window,document:dom,URL,get location(){return location},history:{replaceState(a,b,url){location=new URL(url)}}};
vm.runInNewContext(fs.readFileSync('js/share-navigation.js','utf8'),sandbox);
assert.equal(sandbox.window.currentSharePage(),undefined);
sandbox.window.syncSharePage('hy');assert.equal(location.pathname,new URL('hy/',base).pathname);
for(const p of pages){sandbox.window.syncSharePage(p.lang,p.route);assert.equal(location.pathname,new URL(p.path,base).pathname);assert.equal(dom.documentElement.lang,p.lang);assert.equal(sandbox.window.currentSharePage().route,p.route)}
sandbox.window.syncSharePage('hy','#/patients/faq');assert.equal(location.pathname,new URL('hy/faq/',base).pathname);
const app=fs.readFileSync('js/app.js','utf8');
const initial=/lang: \(function \(\) \{([\s\S]+?)\}\)\(\),/.exec(app)[1];
for(const [explicit,saved,expected] of [['','','hy'],['','en','en'],['en','hy','en'],['hy','en','hy']]){
  const got=vm.runInNewContext('(function(){'+initial+'})()',{document:{documentElement:{dataset:{pageLang:explicit}}},localStorage:{getItem(){return saved}}});assert.equal(got,expected);
}
console.log(`PASS ${pages.length} localized routes, relative assets, FAQ alias and initial language`);
