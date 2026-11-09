/* Author-supplied OP Ver.0.1. Display copy is immutable. */
(function(root){
const script=Object.freeze({
 intro:'『推しを召喚し、従えるカードゲーム「e-Knockmate(エノクメイト)」あなたは、ショップ大会の参加賞パックを開けると、特殊デザインのビジュアルカードを引いた。テキストは全て読めない文字で書いてある』',
 singer:'？？？「人類の皆さーん！！私の歌で死んで下さーい！！では曲は「♪ BーRIーTA AllS MATE」です！」',
 verse:Object.freeze(['God says cheerfully, From now on. We will','test of the humanity','can take a seat of God, All humankind.','Please disappear!!']),
 chorus:Object.freeze(['Ahahahaahaha Ahahahahahaha Ahahahahaahaha All of humanity!','Ahahahaahaha Ahahahahahaha','As your wish Disappear! good!']),
 shout:'「待て！あれは現実を超えた漫画だ！」',
 encounter:'「君、エノクメイトの書を持っているな？協力してもらうぞ！」',
 hack:'Hack a Gate！',
 declaration:'Generate a Key!!'
});
const cues=Object.freeze([
 {scene:1,text:'',image:'assets/rules-guide.webp',manual:true,duration:0},
 {scene:1,text:'',transition:true,duration:650},
 {scene:2,text:script.singer,duration:3300},
 ...script.verse.map((line,i)=>({scene:2,text:script.singer,lyrics:script.verse,active:i,singing:true,duration:[2800,1500,2500,1200][i]})),
 ...script.chorus.map((line,i)=>({scene:2,text:script.singer,lyrics:script.chorus,active:i,singing:true,destruction:true,duration:[2900,1900,1500][i]})),
 {scene:3,text:script.shout,running:true,duration:1600},
 {scene:3,text:script.encounter,encounter:true,duration:1700},
 {scene:3,text:script.hack,encounter:true,hacking:true,duration:600},
 {scene:3,text:script.declaration,declaration:true,duration:950}
].map(Object.freeze));
function createRunner({show,wait,enterBattle,manual=false}){let token=0,entered=false,release=null;function next(){const resolve=release;release=null;resolve?.();}async function start(){const current=++token;entered=false;for(const cue of cues){if(current!==token)return;show(cue);if(cue.manual&&manual)await new Promise(resolve=>release=resolve);else await wait(cue.duration);if(current!==token)return;}if(!entered){entered=true;enterBattle();}}function skip(){token++;next();if(!entered){entered=true;enterBattle();}}function cancel(){token++;next();entered=true;}return {start,skip,cancel,next};}
const api={script,cues,createRunner};if(typeof module==='object'&&module.exports)module.exports=api;else root.EnochOpening=api;
})(typeof window==='undefined'?globalThis:window);
