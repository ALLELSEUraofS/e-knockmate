/* One rendering pipeline: authored Japanese -> English/runes -> optional gaslighting. */
(function(root){
const glyphs='縺繧譁蜿荳髫隱莠螟譛罫魑鬘鬱';
function garble(text){return [...text].map(char=>/\s/u.test(char)?char:glyphs[char.codePointAt(0)%glyphs.length]).join('');}
function create(doc,isActive,translate=text=>text){const records=new Map(),attributes=new Map(),fields=new Map();let observer,working=false,title=null;
function readValue(node){return fields.get(node)?.original??node.value;}
function paint(text){const localized=translate(text);return isActive()?garble(localized):localized;}
function refresh(){if(working)return;working=true;observer?.disconnect();try{if(!title||doc.title!==title.rendered)title={original:doc.title};title.rendered=paint(title.original);if(doc.title!==title.rendered)doc.title=title.rendered;const walker=doc.createTreeWalker(doc.body,4);let node;while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,noscript,[data-no-translate]')||!node.data.trim())continue;let record=records.get(node);if(!record||node.data!==record.rendered){record={original:node.data};records.set(node,record);}record.rendered=paint(record.original);if(node.data!==record.rendered)node.data=record.rendered;}
for(const el of doc.body.querySelectorAll('[aria-label],[placeholder],[title],[alt]')){if(el.closest('[data-no-translate]'))continue;const map=attributes.get(el)||{};for(const attr of ['aria-label','placeholder','title','alt']){if(!el.hasAttribute(attr))continue;const value=el.getAttribute(attr);if(!map[attr]||value!==map[attr].rendered)map[attr]={original:value};map[attr].rendered=paint(map[attr].original);if(value!==map[attr].rendered)el.setAttribute(attr,map[attr].rendered);}attributes.set(el,map);}
for(const field of doc.querySelectorAll('input[type=text],input:not([type]),textarea')){let old=fields.get(field);if(!old||field.value!==old.rendered){old={original:field.value};fields.set(field,old);}old.rendered=isActive()?garble(old.original):old.original;if(field.value!==old.rendered)field.value=old.rendered;}
for(const map of [records,attributes,fields])for(const node of map.keys())if(!node.isConnected)map.delete(node);
}finally{working=false;observer?.observe(doc.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});}}
observer=new root.MutationObserver(refresh);doc.addEventListener('input',refresh,true);refresh();return {refresh,readValue};}
const api={garble,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.EnochText=create(document,()=>root.EnochAleph.has(playerStore.profile,'unreadable-text'),text=>root.EnochI18n.translate(text,root.EnochSecret.language(playerStore.profile).code));
})(typeof window==='undefined'?globalThis:window);
