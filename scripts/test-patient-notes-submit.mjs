import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { File } from 'node:buffer';

const source = fs.readFileSync('js/patient-notes.js', 'utf8');
const start = source.indexOf("form.addEventListener('submit', async function (e)");
const end = source.indexOf('\n        stepContent.appendChild(form);', start);
const handlerSource = source.slice(start, end);
for (const type of ['text', 'handwriting']) {
  let handler, posted, ajax, finished = false;
  const draft = {type, consent:true, text:'Technical test', image:new Blob(['test image'], {type:'image/jpeg'})};
  const context = {
    form:{addEventListener:(_, fn)=>handler=fn}, draft, sending:false,
    preview:()=>false, finish:()=>{finished=true;},
    submit:{}, error:{}, c:{sending:'Sending',send:'Send',sendError:'Error', emailLanguage:'Armenian',emailText:'Typed note',emailHandwriting:'Handwritten photograph',emailConsent:'Confirmed',emailStatus:'Awaiting moderation',consent:'Exact consent wording'},
    publicationName:()=> 'Anonymous', FormData, File, AbortController, setTimeout, clearTimeout,
    location:{origin:'https://www.levongalstyan.com',pathname:'/hy/patients/notes/'},
    DataTransfer:class { constructor(){this.files=[];this.items={add:f=>this.files.push(f)};} },
    el:(tag, props)=>({tag,props,children:[],appendChild(n){this.children.push(n);},submit(){posted=this;}}),
    document:{body:{appendChild(){}}},d:{node:{open:true}},
    fetch:async(url,options)=>{ajax={url,options};return {ok:true,json:async()=>({success:true})};}
  };
  vm.runInNewContext(handlerSource, context);
  await handler({preventDefault(){}});
  if(type==='handwriting') {
    assert.equal(ajax,undefined); assert.equal(finished,false);
    assert.equal(posted.props.enctype,'multipart/form-data');
    assert.equal(posted.props.action,'https://formsubmit.co/galstyan.levon@gmail.com');
    const file = posted.children.find(n=>n.props.name==='attachment').files[0];
    assert.equal(file.name,'patient-note.jpg'); assert.equal(file.size,draft.image.size);
    assert.equal(posted.children.find(n=>n.props.name==='_next').props.value,'https://www.levongalstyan.com/hy/patients/notes/?note-sent=1');
    assert.equal(posted.children.find(n=>n.props.name==='Agreed publication wording').props.value,'Exact consent wording');
  } else {
    assert.equal(finished,true); assert.equal(ajax.options.body.get('Note'),'Technical test');
    assert.equal(ajax.options.body.get('Agreed publication wording'),'Exact consent wording');
    assert.equal(ajax.options.body.has('published'),false);
  }
  console.log('PASS',type,'submission (no network requests)');
}
