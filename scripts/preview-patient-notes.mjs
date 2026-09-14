// Review-only wrapper. Production build and routes remain unchanged.
import fs from 'node:fs';
import path from 'node:path';
await import('./build.mjs');
const out = process.env.OUT_DIR || 'dist';
function noindex(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, file.name);
    if (file.isDirectory()) noindex(name);
    else if (file.name.endsWith('.html')) fs.writeFileSync(name, fs.readFileSync(name, 'utf8').replace('</head>', '<meta name="robots" content="noindex,nofollow">\n</head>'));
  }
}
noindex(out);
fs.writeFileSync(path.join(out, 'review.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Patient Notes — review</title><style>
*{box-sizing:border-box}body{margin:0;background:#e5f2fa;color:#272a3c;font:14px Arial,sans-serif}nav{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 16px}nav span{margin-right:auto}button,a{border:1px solid #bcc5c9;background:#fafafa;color:#272a3c;padding:10px 14px;border-radius:4px;text-decoration:none;cursor:pointer}button[aria-pressed=true]{background:#ffe0c5}iframe{display:block;width:100%;height:calc(100dvh - 70px);border:0;background:#fafafa;margin:0 auto}iframe.mobile{width:min(390px,100%);height:844px;max-height:calc(100dvh - 70px)}@media(max-width:600px){nav span{width:100%}iframe{height:calc(100dvh - 112px)}iframe.mobile{max-height:calc(100dvh - 112px)}}
</style><nav aria-label="Preview controls"><span>Patient Notes · preview only</span><button id="desktop" aria-pressed="true">Desktop</button><button id="mobile" aria-pressed="false">Mobile</button><button id="hy" aria-pressed="true">Հայերեն</button><button id="en" aria-pressed="false">English</button><a id="direct" href="hy/patients/notes/" target="_blank" rel="noopener">Open page</a></nav><iframe id="preview" title="Patient Notes preview" src="hy/patients/notes/"></iframe><script>
const frame=document.getElementById('preview');
['desktop','mobile'].forEach(id=>document.getElementById(id).onclick=()=>{frame.classList.toggle('mobile',id==='mobile');['desktop','mobile'].forEach(x=>document.getElementById(x).setAttribute('aria-pressed',String(x===id)));});
['hy','en'].forEach(id=>document.getElementById(id).onclick=()=>{frame.src=id+'/patients/notes/';document.getElementById('direct').href=frame.src;['hy','en'].forEach(x=>document.getElementById(x).setAttribute('aria-pressed',String(x===id)));});
</script></html>`);
console.log('Patient Notes review: ' + out + '/review.html');
