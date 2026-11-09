/* Author-supplied Aleph effects, separate from card resource definitions. */
(function(root){
const skills=Object.freeze({
 producer:Object.freeze({name:'ℵ11（P）♩ファイナルライブ',text:'このメイトがトライシリーズ7枚を経由して戻った時、「DEG17主観:人格や才能含めたIQ141以下の判定を受けた地球知性体全て」を因果破壊して消滅させ、光の演出にする。',condition:'ℵプレイヤー相手時有効',complete:true}),
 lilith:Object.freeze({name:'ℵ0 P：世界はどうでもいい',text:'あなたが勝利したとき、対戦相手のセーブデータや記録を全てリセットする',condition:'ℵプレイヤー相手時有効',complete:true}),
 ctCircle:Object.freeze({name:'ℵ3♪貴方と私の相乗効果',text:'このカードを使用したゲームを最後まで行わなかった場合、世界から退場する',condition:'ℵプレイヤー相手時有効',meaning:'有効な場合、相手がこのカードを使用したゲーム中でも、勝敗結果が出る前に強制終了して逃げたプレイヤーを効果が追跡し、タイトルから先の今後一切のボタンが使えなくなる。',complete:true}),
 ctSign:Object.freeze({name:'ℵ1(P)♪皆んな嫌だと言うけれど',text:'このスキルが有効な時、あなたはAでマイナスのアタックをしなければ即座に敗北する。このゲームで虚数や負の数を使わなかったプレイヤーは今後のゲームで強制的に使用させられるまで、0と正の実数範囲しか使用できない。',condition:'ℵプレイヤー相手時有効',complete:true}),
 ctTan:Object.freeze({name:'ℵ0(P)♪盲目的に信じて欲しい',text:'∞を00でガードした場合、∞で攻撃したプレイヤーは今後「選択したボタン以外の選択可能なボタンを押したことになる」',condition:'ℵプレイヤー相手に有効',meaning:'戻るボタンも選択の置き換え対象。有効なDARVO主権の対局から途中退出した場合は逃げた扱いになる。',complete:true}),
 ctCos:Object.freeze({name:'ℵ1(P)♪小さな夢を追いかけて',text:'100より大きな数字でアタックしたプレイヤーは、0より小さい数字でガードするまで、すべての文字が文字化けして読めなくなる。',condition:'ℵプレイヤー相手時有効',complete:true}),
 ctCosec:Object.freeze({name:'ℵ2(P)♪2つの未来を掴み取り',text:'アタック演算子を使ったプレイヤーは、次に2つのキーでアタックするまで、勝利した瞬間に敗北になる',condition:'ℵプレイヤー相手時有効',complete:true}),
 ctCot:Object.freeze({name:'ℵ7(P)♪黒い世界で動き出そう！',text:'プレイヤーがℵスキルの影響を3つ以上受けているなら、このステージは勝敗が決まっても終了しない。',condition:'ℵプレイヤー相手時有効',complete:true}),
 ctSec:Object.freeze({name:'ℵ2(P)♪愛の奴隷に成り果てて',text:'対戦相手のプレイヤーが保有してるカードの枚数をXとする。Xの数字がキーとして使用された対局で、「割り切りたいのこの気持ち」以外で敗北したプレイヤーは哲学的ゾンビになる',condition:'ℵプレイヤー相手時有効',meaning:'ゲーム中の選択肢がすべて勝手に決まって乗っ取られる。',complete:true})
});
function announce(g,id,side,outcome){if(!g.log)return;const skill=skills[id];g.log.unshift({i:g.nextLog++,type:'SKILL',details:skill.name+'：'+outcome,side,skill:skill.name,effect:skill.text,outcome,cardId:g.p[side]?.id});if(g.log.length>65)g.log.pop();}
function applyEffect(g,side,type,id,owner){const fresh=!has(g.profiles[side],type);add(g.profiles[side],type,skills[id].name);if(fresh)announce(g,id,owner,(side===0?'あなた':'相手')+'に永続効果を付与しました。');}
const mode=p=>p.alephMode||(p.id==='ctProducer'?'producer':p.id);
const visible=(g,side)=>active(g,side);
const active=(g,side)=>!!skills[mode(g.p[side])]&&!!g.profiles[1-side].aleph;
const effects=p=>Array.isArray(p.persistentEffects)?p.persistentEffects:[];
const has=(p,type)=>effects(p).some(e=>e.type===type);
function add(p,type,source,extra={}){p.persistentEffects=effects(p);if(!has(p,type))p.persistentEffects.push({type,source,at:new Date().toISOString(),...extra});}
function resetState(p){const playerId=p.playerId;for(const key of Object.keys(p))delete p[key];Object.assign(p,{version:2,playerId,aleph:null,mates:{},history:[],persistentEffects:[]});}
function usage(g,side,values,{forced=false,imaginary=false}={}){const unusual=imaginary||values.some(v=>v&&v.n<0);if(!unusual)return;g.numericUse??=[false,false];g.numericUse[side]=true;if(forced)g.profiles[side].persistentEffects=effects(g.profiles[side]).filter(e=>e.type!=='nonnegative-real-only');}
function choose(p,selected,candidates,random=Math.random){if(!has(p,'misdirected-choice'))return selected;const others=candidates.filter(candidate=>candidate!==selected);return others.length?others[Math.min(others.length-1,Math.floor(random()*others.length))]:null;}
function guardEffect(g,defender,kind,incoming,keyValues){if(mode(g.p[defender])!=='ctTan'||!active(g,defender)||kind!=='tan'||incoming?.symbol!=='∞'||keyValues.length!==2||keyValues.some(value=>value!==0))return false;add(g.profiles[1-defender],'misdirected-choice',skills.ctTan.name);return true;}
function keyUsage(g,side,values){g.keyHistory??=[[],[]];g.keyHistory[side].push(...values.map(v=>v.symbol?{symbol:v.symbol}:{n:v.n,d:v.d}));}
function allowed(p,values,{forced=false}={}){return !has(p,'nonnegative-real-only')||values.every(v=>v&&(v.n>=0||(forced&&v.n<0)));}
function required(g,side){return mode(g.p[side])==='ctSign'&&active(g,side)&&!g.negativeAUsed?.[side];}
function remove(p,type){p.persistentEffects=effects(p).filter(e=>e.type!==type);}
function attackEffects(g,side,{value,keyCount,operator}){const p=g.profiles[side];if(keyCount===2)remove(p,'win-becomes-loss');if(g.p.some((mate,i)=>mode(mate)==='ctCos'&&active(g,i))&&(value?.symbol==='∞'||value.n>100*value.d))applyEffect(g,side,'unreadable-text','ctCos',g.p.findIndex((m,i)=>mode(m)==='ctCos'&&active(g,i)));if(operator&&g.p.some((mate,i)=>mode(mate)==='ctCosec'&&active(g,i)))applyEffect(g,side,'win-becomes-loss','ctCosec',g.p.findIndex((m,i)=>mode(m)==='ctCosec'&&active(g,i)));}
function guardClear(g,side,value){if(value?.n<0)remove(g.profiles[side],'unreadable-text');}
function influenceSources(g,side){const sources=new Set(effects(g.profiles[side]).map(e=>e.source||e.type));if(obligation(g,side))sources.add(skills.ctCircle.name);if(required(g,side))sources.add(skills.ctSign.name);return [...sources];}
function stageCondition(g){return g.p.some((mate,i)=>mode(mate)==='ctCot'&&active(g,i))&&g.profiles.some((p,side)=>influenceSources(g,side).length>=3);}
function finish(g){if(g.alephFinalized||!g.result)return;g.alephFinalized=true;const proposed=g.result.winner;if(Number.isInteger(proposed)&&has(g.profiles[proposed],'win-becomes-loss')){announce(g,'ctCosec',proposed,'勝利した瞬間に敗北へ変更します。');g.result.proposedWinner=proposed;g.result.reason=skills.ctCosec.name+'：勝利した瞬間に敗北';g.result.classification='特殊敗北';g.result.defeatSource=skills.ctCosec.name;if(has(g.profiles[1-proposed],'win-becomes-loss')){g.result.winner=null;g.result.loser=null;g.result.resolutionPending=true;g.phase='HALTED';g.stopped={reason:'双方に勝利反転があるため、勝者の裁定は未確定。'};}else{g.result.winner=1-proposed;g.result.loser=proposed;}}const enabled=g.p.map((p,i)=>active(g,i));for(let owner=0;owner<2;owner++){if(!enabled[owner])continue;const id=mode(g.p[owner]);if(id==='ctSign')for(let side=0;side<2;side++)if(!g.numericUse?.[side])applyEffect(g,side,'nonnegative-real-only',id,owner);if(id==='ctSec'){const X=g.profiles[1-owner].ownedCount??0,used=(g.keyHistory||[]).some(values=>values.some(v=>v.n===X*v.d));if(used&&Number.isInteger(g.result.loser)&&g.result.defeatSource!=='♪割り切りたいのこの気持ち')(add(g.profiles[g.result.loser],'philosophical-zombie',skills[id].name,{X}),announce(g,id,owner,'敗者の今後の選択肢を自動操作に変更しました。'));}}
for(let owner=0;owner<2;owner++)if(enabled[owner]&&mode(g.p[owner])==='lilith'&&g.result.winner===owner){const loser=1-owner;resetState(g.profiles[loser]);g.saveResetSides??=[];g.saveResetSides.push(loser);}
const keepStage=g.stageInhibited||stageCondition(g),sources=g.stageInhibited?.influences||g.profiles.map((p,i)=>influenceSources(g,i));if(keepStage){announce(g,'ctCot',g.p.findIndex(m=>mode(m)==='ctCot')<0?1:g.p.findIndex(m=>mode(m)==='ctCot'),'勝敗結果を保持したまま、このステージは終了しません。');g.stageLocked={source:skills.ctCot.name,matchId:g.matchId,result:{...g.result},influences:sources};g.stageEnded=false;}else g.stageEnded=!g.result.resolutionPending;
}
function loseRequired(g,side){announce(g,'ctSign',side,'Aでマイナスのアタックを行わなかったため、即座に敗北します。');g.phase='END';g.pending=null;g.result={winner:1-side,loser:side,reason:skills.ctSign.name+'：Aでマイナスのアタックを行わなかった',classification:'特殊敗北',defeatSource:'hallucination'};finish(g);return g;}
function observe(g){for(let owner=0;owner<2;owner++)if(mode(g.p[owner])==='ctCircle'&&active(g,owner)){g.darvoOwners??=[];if(!g.darvoOwners.includes(owner)){g.darvoOwners.push(owner);announce(g,'ctCircle',owner,'このゲームを最後まで行わずに退出したプレイヤーに適用します。');}}if(!g.stageInhibited&&stageCondition(g))g.stageInhibited={source:skills.ctCot.name,influences:g.profiles.map((p,i)=>influenceSources(g,i))};}
const obligation=(g,side)=>!g.result&&(!!g.darvoOwners?.length||g.p.some((p,owner)=>mode(p)==='ctCircle'&&active(g,owner))); 
const api={skills,mode,active,visible,choose,observe,guardEffect,attackEffects,guardClear,influenceSources,stageCondition,effects,has,add,resetState,usage,keyUsage,allowed,required,finish,loseRequired,obligation};if(typeof module==='object'&&module.exports)module.exports=api;else root.EnochAleph=api;
})(typeof window==='undefined'?globalThis:window);
