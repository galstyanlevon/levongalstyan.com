import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('js/app.js','utf8');
const fn=source.slice(source.indexOf('  function buildContactForm()'),source.indexOf('  function buildContact()'));
function el(tag,props={},children=[]){return {tag,props,children,value:'',appendChild(c){this.children.push(c)},addEventListener(){},reportValidity(){return true},querySelector(selector){const name=/name="([^"]+)"/.exec(selector)?.[1];const match=n=>name?n.props?.name===name:n.props?.class==='form-submit';const walk=n=>match(n)?n:(n.children||[]).filter(c=>typeof c==='object').map(walk).find(Boolean);return walk(this)}};}
for(const [label,response,success] of [
 ['accepted',{ok:true,json:async()=>({success:'true'})},true],
 ['HTTP error',{ok:false,json:async()=>({success:true})},false],
 ['rejected',{ok:true,json:async()=>({success:false})},false],
 ['malformed',{ok:true,json:async()=>{throw Error('Invalid JSON')}},false],
 ['network',null,false]]){
 let sent=false,alerts=0,calls=0;
 const c={el,state:{lang:'hy'},formDraft:{name:'TEST',phone:'000',email:'',message:'TEST'},formSending:false,t:()=>({}),serviceOptionsList:()=>['one','two'],setState:p=>{if(p.sent)sent=true},FormData:class{append(){}},AbortController,setTimeout,clearTimeout,alert:()=>alerts++,fetch:async()=>{calls++;if(!response)throw Error('Network');return response}};
 vm.createContext(c);vm.runInContext(fn+'\nthis.build=buildContactForm;',c);
 const wrap=c.build(),form=wrap.children[1];
 assert.equal(form.querySelector('[name="name"]').value,'TEST');
 form.querySelector('[name="service"]').props.onchange({target:{value:'two'}});
 assert.equal(c.state.service,'two');assert.equal(form.querySelector('[name="name"]').value,'TEST');
 const event={preventDefault(){},target:form};
 form.props.onsubmit(event);form.props.onsubmit(event);
 await new Promise(r=>setTimeout(r,5));
 assert.equal(calls,1);assert.equal(sent,success,label);assert.equal(alerts,success?0:1,label);assert.equal(c.formSending,false);
 assert.equal(c.formDraft.name,success?'':'TEST');
 console.log('PASS',label);
}
