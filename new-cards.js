/* e-Knockmate v0.25 test additions. Existing cards and saves remain intact. */
(function(root){
 'use strict';
 const E=root.Enoch,A=root.EnochAleph;
 const defs={
  reg19:{name:'REG19 ℵ₁「交流祟神、他者利用」ᛚ ᛟ ᛇ ᚱ ᛇ ᛊ',deity:'REG19',keys:[1,2,3,4,5,6,7,10,11,13],ops:['+','−','×','xMODy'],skill:'ごめんで済むから神察はいらない',passiveSkill:'正直な欺瞞',kind:'normal',skillText:'「正直な欺瞞」を使用中なら、キー1つを「嘘だった」とし、別の発音可能な実数へ変更できる。',passiveText:'ゲーム開始時、キーと演算子をすべて公開してよい。公開した場合、各対戦相手は公開されたキーから1つ、自分のキーから1つを使用済みにして消す。'},
  ura:{name:'R18「圏力鬼神」破釜ウラ',deity:'Revenger18',keys:[-1,1,2,3,5,7,11,17,19,139],ops:['+','−','xMODy','i'],skill:'選考のLONDOH',kind:'normal',skillText:'残りキー5個で使用。相手は使用メイトをこれと交換できる（使用状況を引き継ぐ）。交換しない場合、あなたの次のアタックはガードできない。'},
  rdoc11:{name:'RDoC11「自己開封」大流ロス',deity:'RDoC11',keys:[9,7,4,2,1,1,2,4,5,9],ops:['+','−','×','÷'],skill:'逆3面鏡の鈍角逆封鎖',kind:'normal',skillText:'同一数字のキー2つと＋−×÷のいずれかを使ってガードできる。このスキルによるガード値が16以上なら「カウンターメイト」を得る。'},
  gradEmpty:{name:'GRAD ∅「空集合」羅節ゼノン',deity:'圧力否定',keys:[0,1,2,3,4,6,8,9,10,12],ops:['+','−','not','∅'],passiveSkill:'存在不能存在証明',kind:'normal',passiveText:'notでガードした時、各プレイヤーはキーか演算子を指定し、使用メイトから2つを消滅させる。これによりキーが全て消えたプレイヤーは消滅する。'},
  graded400:{name:'Graded400「インフレーション」釣果グース',deity:'Graded400',keys:[0,1,2,4,8,0,1,2,6,24],ops:['+','−','×','÷'],skill:'サイドステップ',passiveSkill:'勝者は二人！',kind:'normal',skillText:'キーを1つ選び、その2倍か半分でガードまたはアタックする。',passiveText:'このメイトがアピアメイトした時、敗北しなかったメイトを1つ選び、互いに勝利とする。'},
  miruha:{name:'E=mu²「神隠し」海流波（ミルハ）',deity:'E=mu²',keys:[1,2,4,6,8,10,12,20,66,100],ops:['+','−','×','÷'],skill:'運のない世界',passiveSkill:'ℵ₆(P) 137年間問題「歴史の先端」',kind:'normal',skillText:'メイト1つを選ぶ。D4、D6、D8、D12、D20のいずれかを振り、相手の残りキーをその出目にする。',passiveText:'ℵプレイヤー相手時有効。キーの宣言が1、3、7の順で登場する、または137のキーが使用されると、全員敗北する。'},
  quantum:{name:'R=DEG17「量子探偵」久遠他無',deity:'久遠他無',keys:[2,3,4,5,6,7,1,6,8,10,12],ops:['+','−','×','÷'],skill:'量子攻撃',passiveSkill:'重なる世界',kind:'quantum',skillText:'キーを2つ選び「どちらかでアタック」と宣言。相手のガード後、ガードに対して都合のよい方のキーで攻撃した事実を選ぶ。不可能な選択はスルー扱いとなり、2キーを消費する。',passiveText:'複数の可能性がある攻撃が同時にガードされ、どちらも成立した時、プレイヤーはℵ:InfinityZeroを得る。このラベルは存在確率が0%になるまで保持する。'}
 };
 Object.assign(E.CARD_DEFS,defs);
 const ids=Object.keys(defs),art={ura:'assets/ura-dragon-inferno-burst.jpeg',miruha:'assets/miruha-137-year-problem.png',quantum:'assets/quantum-detective-kuon-tamu.png'};
 const original={attack:E.attack,guards:E.guards,guard:E.guard,pass:E.pass,autoAttack:E.autoAttack,autoRespond:E.autoRespond};
 const aliveAleph=(g,side)=>!!g.profiles?.[side]?.aleph&&!!g.profiles?.[1-side]?.aleph;
 function allLose(g,reason,side){g.result={winner:null,loser:null,losers:[0,1],everyoneLost:true,reason,classification:'全員敗北'};g.phase='END';g.pending=null;g.turn=side;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'ℵ₆ 137年間問題：条件成立。全員敗北。',side,skill:defs.miruha.passiveSkill,effect:defs.miruha.passiveText,outcome:reason});g.log.unshift({i:g.nextLog++,type:'END',details:'全員敗北。勝者はいません。',side});return g;}
 function alephLabel(g,side){const p=g.profiles[side];p.alephLabels=Array.isArray(p.alephLabels)?p.alephLabels:[];if(!p.aleph)p.aleph='InfinityZero';if(!p.alephLabels.includes('InfinityZero'))p.alephLabels.push('InfinityZero');A.add(p,'infinity-zero-quantum','重なる世界',{matchId:g.matchId,until:'このラベルの存在確率が0%になるまで'});g.log.unshift({i:g.nextLog++,type:'SKILL',details:'重なる世界：プレイヤー主体にℵ:InfinityZeroを付与。',side,skill:defs.quantum.passiveSkill,effect:defs.quantum.passiveText,outcome:'対局後も保持します。'});}
 function observeMihura(g){
  if(!g||g.result||!g.p?.some(p=>p.id==='miruha'))return;
  const owner=g.p.findIndex(p=>p.id==='miruha');if(owner<0||!aliveAleph(g,owner))return;
  const used=(g.keyHistory||[]).flat().filter(v=>Number.isFinite(v.n)&&v.d===1).map(v=>v.n);
  if(used.includes(137))return allLose(g,'137のキーが使用された',owner);
  let stage=0;for(const n of used){if(n===[1,3,7][stage])stage++;if(stage===3)return allLose(g,'キー宣言が1、3、7の順で登場した',owner);}
 }
 function resolveGradedWin(g){if(g?.result&&!g.result.everyoneWon){const winner=g.result.winner;if(Number.isInteger(winner)&&g.p[winner]?.id==='graded400'&&E.available(g.p[winner]).length===0){g.result={...g.result,winner:null,loser:null,winners:[0,1],everyoneWon:true,classification:'勝者は二人！',reason:'Graded400「勝者は二人！」'};g.log.unshift({i:g.nextLog++,type:'SKILL',details:'勝者は二人！：敗北しなかったメイトを選択。双方を勝者として記録。',side:winner,skill:defs.graded400.passiveSkill,effect:defs.graded400.passiveText,outcome:'対局参加者双方が勝利しました。'});}}}
 E.attack=function(g,side,ids,mode='normal',primeMode='double'){
  if(mode!=='quantum'){
   const graded=g.gradedAction?.side===side?g.gradedAction:null;
   if(graded){if(ids.length!==1||ids[0]!==graded.keyId)throw Error('サイドステップで選んだキーを使ってください');const key=g.p[side].keys[graded.keyId],old=key.val;key.val=graded.value;try{const result=original.attack(g,side,ids,mode,primeMode);g.gradedAction=null;observeMihura(g);resolveGradedWin(g);return result;}finally{key.val=old;}}
   const result=original.attack(g,side,ids,mode,primeMode);if(g.pending?.attacker===side&&g.p[side]?.id==='ura'&&g.p[side].uraUnblockable){g.pending.uraForced=true;g.p[side].uraUnblockable=false;}observeMihura(g);resolveGradedWin(g);return result;
  }
  const p=g.p[side];if(p.id!=='quantum'||!p.quantumArmed||ids.length!==2)throw Error('量子攻撃には未使用のAとキー2つが必要です');
  const [a,b]=ids.map(i=>p.keys[i]);if(!a||!b||a===b||a.used||b.used)throw Error('未使用キーを2つ選んでください');
  const branchValues=[E.rat(a.val),E.rat(b.val)];p.keys[b.id].used=true;
  const before=g.nextLog;const result=original.attack(g,side,[a.id],'normal',primeMode);p.quantumArmed=false;
  if(g.result)return result;
  g.pending.quantum={values:branchValues,keys:[a.id,b.id]};g.pending.attackKeys=[a.id,b.id];g.pending.expression=`${a.val} または ${b.val}`;
  const ev=g.log.find(x=>x.i===before&&x.type==='ATTACK');if(ev){ev.details=`${side===0?'YOU':'CPU'}：「${a.val} または ${b.val}」の量子攻撃を宣言。`;ev.expression=`${a.val} / ${b.val}`;ev.keyValues=[a.val,b.val];ev.kind='quantum';}
  g.log.unshift({i:g.nextLog++,type:'SKILL',details:'量子攻撃：2つのキーを候補として宣言。相手のガード後に分岐を確定します。',side,skill:defs.quantum.skill,effect:defs.quantum.skillText,outcome:'候補キー2つを消費し、ガード応答を待っています。'});
  observeMihura(g);return result;
 };
 E.guards=function(g,side){
  if(g.pending?.uraForced)return [];
  const graded=g.gradedAction?.side===side?g.gradedAction:null;
  if(graded){const key=g.p[side].keys[graded.keyId],old=key.val;key.val=graded.value;try{return original.guards(g,side).filter(m=>m.ids.includes(graded.keyId)).map(m=>({...m,gradedKeyId:graded.keyId}));}finally{key.val=old;}}
  if(g.p[side]?.id==='rdoc11'&&g.p[side].counterGuardArmed)return original.guards(g,side).filter(m=>m.ids.length===2&&g.p[side].keys[m.ids[0]].val===g.p[side].keys[m.ids[1]].val&&m.ops.length===1);
  if(g.p[side]?.id==='gradEmpty'&&g.p[side].ops.some(o=>o.sym==='not'&&!o.used)){const p=g.p[side],excluded=E.available(p).filter(k=>!E.eq(E.rat(k.val),g.pending.value));return excluded.map(k=>({kind:'not',ids:[k.id],ops:[p.ops.find(o=>o.sym==='not').id],values:[E.rat(k.val),g.pending.value],expression:`not(${k.val})：${E.printRat(g.pending.value)}をガード`,label:`not ${k.val}`}));}
  const normal=original.guards(g,side);if(!g.pending?.quantum)return normal;
  const base=g.pending.value,options=[];
  for(let branch=0;branch<g.pending.quantum.values.length;branch++){
   g.pending.value=g.pending.quantum.values[branch];
   for(const move of original.guards(g,side))options.push({...move,quantumBranch:branch,quantumValue:g.pending.value});
  }
  g.pending.value=base;
  const seen=new Set();return options.filter(move=>{const k=JSON.stringify([move.kind,move.ids,move.ops,move.copyKey,move.shift,move.quantumBranch]);if(seen.has(k))return false;seen.add(k);return true;});
 };
 E.guard=function(g,side,option){
  if(g.pending?.uraForced)throw Error('選考のLONDOH：このアタックはガードできません。');
  if(option.kind==='not'&&g.p[side]?.id==='gradEmpty'){
   const p=g.p[side],key=p.keys[option.ids[0]],op=p.ops[option.ops[0]],incoming=g.pending.value,originalValue=key.val;if(!key||key.used||!op||op.used||!incoming)throw Error('notガードの宣言が無効です');
   key.val=Number(E.printRat(incoming));let base;try{base=original.guards(g,side).find(m=>m.kind==='same'&&m.ids[0]===key.id);}finally{key.val=originalValue;}
   if(!base)throw Error('notガードの値を具体的に宣言できません');const result=original.guard(g,side,base);op.used=true;
   const ev=g.log.find(x=>x.type==='GUARD');if(ev){ev.expression=`not(${originalValue})：${E.printRat(incoming)}`;ev.details=`${side===0?'YOU':'CPU'}：${ev.expression}。notガード成功、手番移動。`;}
   g.log.unshift({i:g.nextLog++,type:'SKILL',details:'存在不能存在証明：notでガード。各プレイヤーから2資源を消滅させます。',side,skill:defs.gradEmpty.passiveSkill,effect:defs.gradEmpty.passiveText,outcome:'全プレイヤーに資源消滅を適用しました。'});
   for(let owner=0;owner<2;owner++){const mate=g.p[owner],pool=[...mate.keys.map((x,i)=>({type:'key',i})),...mate.ops.map((x,i)=>({type:'op',i}))];let remove=[];if(owner===0&&typeof prompt==='function'){const answer=prompt(`存在不能存在証明：消滅させる資源を2つ指定（例 K1,O2）。\n${pool.map(x=>`${x.type==='key'?'K':'O'}${x.i+1}`).join(' ')}`,'K1,K2');if(answer)remove=answer.split(',').map(s=>s.trim().toUpperCase()).slice(0,2).map(s=>({type:s[0]==='O'?'op':'key',i:Number(s.slice(1))-1})).filter(x=>Number.isInteger(x.i)&&x.i>=0);}
    while(remove.length<2&&pool.length){const candidate=pool[Math.floor(Math.random()*pool.length)];if(!remove.some(x=>x.type===candidate.type&&x.i===candidate.i))remove.push(candidate);if(remove.length>=pool.length)break;}
    for(const item of remove.sort((a,b)=>a.type===b.type?b.i-a.i:a.type==='op'?-1:1)){const list=item.type==='key'?mate.keys:mate.ops;if(list[item.i])list.splice(item.i,1);}mate.keys.forEach((x,i)=>x.id=i);mate.ops.forEach((x,i)=>x.id=i);g.log.unshift({i:g.nextLog++,type:'NOTICE',details:`${owner===0?'あなた':'相手'}の使用メイトから資源2つが消滅。`,side:owner,skill:defs.gradEmpty.passiveSkill});}
   const vanished=[0,1].filter(i=>g.p[i].keys.length===0);if(vanished.length===2){g.result={winner:null,loser:null,losers:[0,1],everyoneLost:true,reason:'存在不能存在証明：両プレイヤーのキーが消滅',classification:'全員消滅'};g.phase='END';g.pending=null;}else if(vanished.length){const loser=vanished[0];g.result={winner:1-loser,loser,reason:'存在不能存在証明：キーが全て消滅',classification:'消滅'};g.phase='END';g.pending=null;}observeMihura(g);return result;
  }
  const graded=g.gradedAction?.side===side?g.gradedAction:null;
  if(graded){if(!option.ids.includes(graded.keyId))throw Error('サイドステップで選んだキーを使ってください');const key=g.p[side].keys[graded.keyId],old=key.val;key.val=graded.value;try{const {gradedKeyId,...plain}=option;const result=original.guard(g,side,plain);g.gradedAction=null;observeMihura(g);resolveGradedWin(g);return result;}finally{key.val=old;}}
  if(!g.pending?.quantum){const result=original.guard(g,side,option);if(g.p[side]?.id==='rdoc11'&&g.p[side].counterGuardArmed&&option.ids?.length===2&&g.p[side].keys[option.ids[0]].val===g.p[side].keys[option.ids[1]].val){const guardValue=option.values?.at(-1);if(guardValue&&guardValue.n>=16*guardValue.d){g.p[side].counterMate=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'カウンターメイトを獲得：このスキルによるガード値が16以上。',side,skill:defs.rdoc11.skill,effect:defs.rdoc11.skillText,outcome:'カウンターメイト状態になりました。'});}}observeMihura(g);resolveGradedWin(g);return result;}
  const pending=g.pending,branch=option.quantumBranch??0;pending.value=pending.quantum.values[branch];
  const {quantumBranch,quantumValue,...plain}=option;const beforeResult=g.result;
  const result=original.guard(g,side,plain);observeMihura(g);if(g.result||g.phase==='END')return result;
  const guardValue=pending.value;const both= pending.quantum.values.every(value=>E.eq(value,guardValue));
  if(both){alephLabel(g,pending.attacker);g.pending=null;g.phase='ATTACK';g.turn=side;return g;}
  g.quantumChoice={side:pending.attacker,defender:side,values:pending.quantum.values,keys:pending.quantum.keys,guardValue,wasGuarded:true};g.phase='QUANTUM_CHOICE';g.turn=pending.attacker;return g;
 };
 E.pass=function(g,side){const quantum=g.pending?.quantum,attacker=g.pending?.attacker,forced=g.pending?.uraForced;const result=original.pass(g,side);observeMihura(g);if(forced)g.log.unshift({i:g.nextLog++,type:'SKILL',details:'選考のLONDOH：次のアタックはガード不能。相手がスルーしました。',side:attacker,skill:defs.ura.skill,effect:defs.ura.skillText,outcome:'アタックが通りました。'});if(quantum&&!g.result){g.quantumChoice={side:attacker,defender:side,values:quantum.values,keys:quantum.keys,guardValue:null,wasGuarded:false};g.phase='QUANTUM_CHOICE';g.turn=attacker;}resolveGradedWin(g);return result;};
 E.chooseQuantum=function(g,side,index){if(g.phase!=='QUANTUM_CHOICE'||g.quantumChoice?.side!==side)throw Error('量子分岐の選択タイミングではありません');const q=g.quantumChoice,value=q.values[index];if(!value)throw Error('選べない分岐です');const allowed=A.allowed(g.profiles[side],[value],{forced:g.forcedActionSide===side});g.quantumChoice=null;g.pending=null;
  if(!allowed){g.phase='ATTACK';g.turn=side;g.log.unshift({i:g.nextLog++,type:'PASS',details:'量子攻撃：選択した分岐は実行不可能。スルー扱い。2つのキーは消費済み。',side,kind:'quantum'});return g;}
  if(q.wasGuarded&&E.eq(value,q.guardValue)){g.phase='ATTACK';g.turn=q.defender;g.log.unshift({i:g.nextLog++,type:'NOTICE',details:`量子攻撃：${E.printRat(value)}の分岐を選択。ガード成立、手番移動。`,side,skill:defs.quantum.skill});}
  else {g.phase='ATTACK';g.turn=side;g.log.unshift({i:g.nextLog++,type:'NOTICE',details:`量子攻撃：${E.printRat(value)}の分岐を選択。選ばれなかった分岐へのガードは成立しません。`,side,skill:defs.quantum.skill});}
  return g;
 };
 E.passiveLabel=(id)=>defs[id]?.passiveSkill||'';
 E.extraCards={ids,art,defs,activeAleph:aliveAleph,start(g,side,reveal){const p=g.p[side];if(p.id!=='reg19'||!reveal)return g;p.revealed=true;p.honestDeception=true;const shown=E.available(p),target=g.p[1-side],own=E.available(target);if(shown.length)shown[Math.floor(Math.random()*shown.length)].used=true;if(own.length)own[Math.floor(Math.random()*own.length)].used=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'正直な欺瞞：カードのキーと演算子を公開。双方からキー1つずつを使用済みにしました。',side,skill:defs.reg19.passiveSkill,effect:defs.reg19.passiveText,outcome:'正直な欺瞞を使用中です。'});return g;},activate(g,side,choice={}){
  const p=g.p[side];if(!ids.includes(p.id))throw Error('このカードのA効果ではありません');
  if(p.id==='quantum'){if(g.phase!=='ATTACK'||g.turn!==side||p.aUsed)throw Error('自分の攻撃手番で一度だけ使用できます');p.aUsed=true;p.revealed=true;p.quantumArmed=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'量子攻撃：候補キー2つを選べる状態になりました。',side,skill:defs.quantum.skill,effect:defs.quantum.skillText,outcome:'キー2つを選び、量子攻撃を宣言してください。'});return g;}
  if(p.id==='reg19'){if(!p.honestDeception)throw Error('先に「正直な欺瞞」でキーを公開してください');const index=Number.isInteger(choice.keyId)?choice.keyId:-1;if(index<0)throw Error('変更するキーを選んでください');const raw=String(choice.value??'');if(!/^-?\d+(?:\.\d+)?$/.test(raw))throw Error('有限小数の実数を入力してください');const value=Number(raw);if(!Number.isFinite(value))throw Error('有限の実数を入力してください');p.keys[index].val=value;p.aUsed=true;p.revealed=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'ごめんで済むから神察はいらない：キーを「嘘だった」とし、別の実数へ変更。',side,skill:defs.reg19.skill,effect:defs.reg19.skillText,outcome:`キー${index+1}を${value}へ変更しました。`});return g;}
  if(p.id==='ura'){if(E.available(p).length!==5||p.aUsed)throw Error('残りキー5個の時に一度だけ使用できます');p.aUsed=true;p.revealed=true;p.uraUnblockable=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'選考のLONDOH：交換の申し出。相手が交換しなければ次のアタックはガード不能。',side,skill:defs.ura.skill,effect:defs.ura.skillText,outcome:'次のアタックにガード不能の指定を設定しました。'});return g;}
  if(p.id==='rdoc11'){if(p.aUsed)throw Error('使用済みです');p.aUsed=true;p.revealed=true;p.counterGuardArmed=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:'逆3面鏡の鈍角逆封鎖：同一数字2キーでのガードを有効化。',side,skill:defs.rdoc11.skill,effect:defs.rdoc11.skillText,outcome:'この対局中、同一数字キー2つによるガードを選べます。'});return g;}
  if(p.id==='graded400'){if(p.aUsed)throw Error('使用済みです');const ids=choice.ids;if(!Array.isArray(ids)||ids.length!==1)throw Error('キーを1つ選んでください');const key=p.keys[ids[0]],factor=choice.factor;if(!key||key.used||!['double','half'].includes(factor))throw Error('キーまたは倍率の選択が不正です');const value=factor==='double'?key.val*2:key.val/2;if(!Number.isFinite(value))throw Error('有限の数になりません');p.aUsed=true;p.revealed=true;g.gradedAction={side,keyId:key.id,value,factor};g.log.unshift({i:g.nextLog++,type:'SKILL',details:`サイドステップ：キー${key.id+1}を${factor==='double'?'2倍':'半分'}の${value}として使う。`,side,skill:defs.graded400.skill,effect:defs.graded400.skillText,outcome:'次のガードまたはアタックで選択値を適用します。'});return g;}
  if(p.id==='miruha'){if(p.aUsed)throw Error('使用済みです');const sides=[4,6,8,12,20],sidesPick=choice.die||6;if(!sides.includes(sidesPick))throw Error('D4/D6/D8/D12/D20を選んでください');const roll=1+Math.floor(Math.random()*sidesPick),target=g.p[1-side];for(const key of E.available(target))key.val=roll;p.aUsed=true;p.revealed=true;g.log.unshift({i:g.nextLog++,type:'SKILL',details:`運のない世界：D${sidesPick}を振り、出目${roll}。相手の残りキーを${roll}に変更。`,side,skill:defs.miruha.skill,effect:defs.miruha.skillText,outcome:`相手の残りキー${E.available(target).length}個を${roll}にしました。`});return g;}
  throw Error('このカードのAスキルはまだ利用できません');
 }};
 root.EnochExtra=E.extraCards;
})(typeof window==='undefined'?globalThis:window);
