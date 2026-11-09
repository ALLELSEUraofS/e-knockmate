/* Original test score: MIDI note numbers, major-key melodies, no vocals. */
(function(root){
const themes={
 boss:{name:'全人未倒のチュートリアル',bpm:168,melody:[]},
 title:{name:'扉の向こうへ',bpm:148,melody:[72,76,79,76,74,77,81,79,76,79,84,83,81,79,76,74]},
 shop:{name:'一枚の出会い',bpm:136,melody:[76,79,76,72,74,77,74,71,72,76,79,76,74,72,71,72]},
 story:{name:'友として話そう',bpm:110,melody:[72,0,76,79,77,76,74,0,76,0,79,84,81,79,76,0]},
 live:{name:'七つの声、ひとつの約束',bpm:168,melody:[72,76,79,79,81,79,76,74,72,74,76,79,77,76,74,72,76,79,84,84,83,81,79,76,77,81,79,76,74,76,72,0]},
 battle:{name:'さあ、やってみよう！',bpm:164,melody:[72,72,79,76,77,77,81,79,76,79,84,79,81,79,76,74]},
 finale:{name:'最高のステージへ',bpm:168,melody:[79,84,83,84,81,84,79,76,77,81,84,86,84,83,84,0]},
 result:{name:'ここまでの一歩',bpm:136,melody:[72,76,79,84,83,79,81,0,77,81,79,76,74,76,72,0]}
};
const chords=[[48,60,64,67],[53,60,65,69],[55,62,67,71],[48,60,64,67]];
function create({contextFactory=()=>new(root.AudioContext||root.webkitAudioContext)(),setTimer=setInterval,clearTimer=clearInterval}={}){
 let ctx,master,timer=null,enabled=false,hidden=false,volume=.35,scene='title',part=0,dense=false,step=0,next=0;const voices=new Set();let bossBuffer=null,bossLoading=null,bossSource=null,bossOffset=0,bossStarted=0;
 function pauseBoss(){if(!bossSource)return;bossOffset=(bossOffset+ctx.currentTime-bossStarted)%(bossBuffer?.duration||1);bossSource.stop();bossSource.disconnect();bossSource=null;}
 function playBoss(){if(bossSource||!bossBuffer||!enabled||hidden||scene!=='boss')return;bossSource=ctx.createBufferSource();bossSource.buffer=bossBuffer;bossSource.loop=true;bossSource.connect(master);bossStarted=ctx.currentTime;bossSource.start(0,bossOffset);}
 function loadBoss(){if(!ctx.decodeAudioData)return;if(bossBuffer){playBoss();return;}bossLoading??=fetch('assets/cp1-tutorial.mp3').then(r=>{if(!r.ok)throw Error('BGM load failed');return r.arrayBuffer();}).then(b=>ctx.decodeAudioData(b)).then(b=>{bossBuffer=b;playBoss();}).catch(()=>{bossLoading=null;});}
 function drum(time,snare=false){if(!ctx.createBuffer){note(snare?84:36,time,.08,.04,'sine');return;}const length=Math.floor(ctx.sampleRate*.11),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(length*.19));const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffer;gain.gain.setValueAtTime(snare?.11:.025,time);src.connect(gain);gain.connect(master);src.onended=()=>{voices.delete(src);src.disconnect();gain.disconnect();};voices.add(src);src.start(time);src.stop(time+.12);if(!snare)note(36,time,.15,.16,'sine');}
 function hush(){for(const o of voices){try{o.stop();}catch{}}voices.clear();}
 function note(midi,time,duration,level,type='triangle'){if(!midi)return;const o=ctx.createOscillator(),gain=ctx.createGain();o.type=type;o.frequency.setValueAtTime(440*2**((midi-69)/12),time);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(gain);gain.connect(master);o.onended=()=>{voices.delete(o);o.disconnect();gain.disconnect();};voices.add(o);o.start(time);o.stop(time+duration+.02);}
 function tick(){if(!enabled||hidden||!ctx||ctx.state==='suspended'||scene==='boss')return;const t=themes[scene],beat=60/t.bpm/2;if(next<ctx.currentTime)next=ctx.currentTime+.025;while(next<ctx.currentTime+.12){const chord=chords[Math.floor(step/8)%4],mel=t.melody[step%t.melody.length];note(mel,next,beat*.8,.065,['sawtooth','triangle','sawtooth','triangle','sawtooth','triangle','sawtooth'][part%7]);if(mel)note(mel-12,next,beat*.6,.025,'triangle');if(scene!=='story'){if(step%2===0)drum(next,step%4===2);else drum(next);if(step%4===0)for(const n of chord.slice(1))note(n,next,beat*1.6,.025,'sawtooth');}if(step%2===0)note(chord[0],next,beat*1.6,.055,'sine');note(chord[1+(step%3)],next,beat*.65,.025,'sine');if(dense||scene==='finale'){if(step%4===0)note(mel?mel+12:84,next,beat*1.4,.018,'sine');if(step%2===1)note(96,next,.035,.009,'triangle');}if(scene==='live'&&part%3===2&&step%2===0)note(chord[2]+12,next,beat,.02,'sine');step++;next+=beat;}}
 function start(){if(!enabled||hidden)return;ctx??=contextFactory();if(!master){master=ctx.createGain();master.connect(ctx.destination);}master.gain.setValueAtTime(volume,ctx.currentTime);loadBoss();if(scene==='boss')playBoss();const resumed=ctx.resume();if(resumed?.catch)resumed.catch(()=>{});if(timer===null)timer=setTimer(tick,25);tick();}
 function stop(){pauseBoss();if(timer!==null)clearTimer(timer);timer=null;hush();}
 function setEnabled(value){enabled=!!value;if(enabled){try{start();}catch{enabled=false;stop();}}else stop();return enabled;}
 function setScene(value,options={}){value=themes[value]?value:'title';if(value!==scene){pauseBoss();hush();scene=value;step=0;next=ctx?ctx.currentTime+.025:0;if(scene==='boss'&&enabled)start();}part=options.part||0;dense=!!options.dense;}
 function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));if(master)master.gain.setTargetAtTime(volume,ctx.currentTime,.03);}
 function setHidden(value){hidden=!!value;if(hidden)stop();else if(enabled)start();}
 return {setEnabled,setScene,setVolume,setHidden,stop,get state(){return {enabled,scene,part,dense,volume,step,voices:voices.size,name:themes[scene].name};}};
}
const api={themes,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.EnochMusic=api;
})(typeof globalThis==='undefined'?this:globalThis);
