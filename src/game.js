import {makeLevel,WORLD,CHAPTERS} from './level.js';
import {createPlayer,updatePlayer,overlap} from './player.js';
import {Renderer} from './render.js';
import {Audio} from './audio.js';
const $=s=>document.querySelector(s);
export class Game {
 constructor(){this.audio=new Audio();this.renderer=new Renderer($('#game'));this.keys=new Set();this.state='title';this.time=0;this.camera=0;this.particles=[];this.shown=new Set();this.reset(false);this.bind();this.last=performance.now();this.accumulator=0;requestAnimationFrame(t=>this.frame(t));}
 reset(play=true){this.level=makeLevel();this.player=createPlayer();this.checkpoint=-1;this.clips=0;this.elapsed=0;this.deaths=0;this.camera=0;this.shake=0;this.particles=[];this.chapter=0;this.shown.clear();for(const e of this.level.enemies){e.base=e.y;e.phase=e.x;e.groundY=e.y+e.h;}this.keys.clear();this.state=play?'playing':'title';$('#clip-total').textContent='/ '+this.level.clips.length;this.updateHud();if(play){this.hideOverlay();this.audio.init();this.hint('A / D to explore · Hold SPACE for a higher jump',5);$('#game').focus();}}
 bind(){window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Escape'].includes(e.code))e.preventDefault();if(e.repeat)return;
  if(e.code==='Escape'){if(this.state==='playing')this.pause();else if(this.state==='paused')this.resume();return;}
  if(e.code==='KeyR'){this.reset();return;}
  if(this.state==='title'&&(e.code==='Enter'||e.code==='Space')){this.reset();return;}
  if(this.state==='won'&&e.code==='Enter'){this.reset();return;}
  this.keys.add(e.code);if(['Space','KeyW','ArrowUp'].includes(e.code)&&this.state==='playing')this.player.buffer=.14;
 });window.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>{this.keys.clear();if(this.state==='playing')this.pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.state==='playing')this.pause();});$('#play').onclick=()=>this.reset();$('#pause-button').onclick=()=>this.pause();$('#sound').onclick=()=>{this.audio.init();const on=this.audio.toggle();$('#sound').innerHTML=`${on?'♫':'♪'} <span>SOUND ${on?'ON':'OFF'}</span>`;$('#sound').setAttribute('aria-label',`Turn sound ${on?'off':'on'}`);};}
 hideOverlay(){$('#overlay').classList.add('hidden');$('#hud').classList.remove('hidden');}
 pause(){if(this.state!=='playing')return;this.state='paused';this.keys.clear();this.modal('<div class="eyebrow">A MOMENT TO YOURSELF</div><h2>A little desk break.</h2><p>Your adventure will be right here.</p><button id="resume" class="primary">Keep exploring <span>↗</span></button><button id="restart" class="secondary">Start a new adventure · R</button>');$('#resume').onclick=()=>this.resume();$('#restart').onclick=()=>this.reset();$('#resume').focus();}
 resume(){if(this.state!=='paused')return;this.state='playing';this.hideOverlay();this.keys.clear();$('#game').focus();}
 modal(html){const o=$('#overlay');o.className='overlay modal-overlay';o.innerHTML=`<div class="modal">${html}</div>`;}
 hint(text,duration=3){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),duration*1000);}
 once(key,text){if(!this.shown.has(key)){this.shown.add(key);this.hint(text);}}
 burst(x,y,n,color,star=false){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*110,l=.25+Math.random()*.5;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-35,life:l,max:l,size:star?6:1+Math.random()*3,color,star});}}
 damage(fall=false){const p=this.player;if(p.invincible>0&&!fall)return;p.health--;p.controlledJump=false;this.audio.play('hurt');this.shake=6;this.burst(p.x+14,p.y+20,16,'#e5b482');if(fall||p.health<=0){if(p.health<=0){p.health=3;this.deaths++;this.hint('A fresh breath. Back at your last checkpoint.');}else this.hint('Watch your step! Back on solid ground.');const cp=this.checkpoint>=0?this.level.checkpoints[this.checkpoint]:{x:170,y:608};p.x=cp.x+15;p.y=cp.y-p.h-5;p.vx=0;p.vy=0;p.grounded=false;p.coyote=0;p.buffer=0;this.camera=Math.max(0,p.x-370);}else{p.vy=-310;p.vx=-p.facing*180;this.hint('Ouch! Keep going — you’ve got this.',1.7);}p.invincible=1.8;this.updateHud();}
 win(){this.state='won';this.keys.clear();this.audio.play('win');for(let i=0;i<8;i++)this.burst(this.player.x-150+Math.random()*500,150+Math.random()*250,20,['#f2cb6b','#8cb69a','#e8a078'][i%3],true);const m=Math.floor(this.elapsed/60),s=String(Math.floor(this.elapsed%60)).padStart(2,'0');this.modal(`<div class="eyebrow">SMALL FEET. GREAT BIG ADVENTURE.</div><div class="medal">✦</div><h2>You made it, Pip.</h2><p>Across the books. Beyond the keyboard.<br>Who knew an ordinary desk held so much?</p><div class="stats"><div><strong>${this.clips}<small style="font-size:16px">/${this.level.clips.length}</small></strong><span>PAPER CLIPS</span></div><div><strong>${m}:${s}</strong><span>DESK TIME</span></div><div><strong>${this.level.clips.filter(c=>c.secret&&c.taken).length}</strong><span>SECRET FINDS</span></div></div><button id="replay" class="primary">One more adventure <span>↻</span></button><button id="wander" class="secondary">Keep exploring the desk</button>`);$('#replay').onclick=()=>this.reset();$('#wander').onclick=()=>{this.state='playing';this.hideOverlay();this.player.x-=130;this.player.invincible=2;$('#game').focus();};$('#replay').focus();}
 updateHud(){$('#health').textContent=Array.from({length:3},(_,i)=>i<this.player.health?'♥':'♡').join(' ');$('#health').setAttribute('aria-label',this.player.health+' health points');$('#clip-count').textContent=String(this.clips).padStart(2,'0');$('#progress').style.width=Math.min(100,this.player.x/this.level.finish.x*100)+'%';$('#section-name').textContent=`0${this.chapter+1} · ${CHAPTERS[this.chapter]}`;}
 step(dt){if(this.state==='playing'){
  this.elapsed+=dt;const p=this.player,oldBottom=p.y+p.h;updatePlayer(this,dt);
  for(const e of this.level.enemies){if(e.dead)continue;e.x+=e.vx*dt;if(e.x<e.min){e.x=e.min;e.vx=Math.abs(e.vx);}if(e.x>e.max){e.x=e.max;e.vx=-Math.abs(e.vx);}if(e.type==='key'){e.phase+=dt*2.5;e.y=e.base-Math.max(0,Math.sin(e.phase))*47;}
   if(overlap(p,e)){if(p.vy>30&&oldBottom<e.y+15){e.dead=true;p.vy=-410;p.controlledJump=false;this.audio.play('stomp');this.burst(e.x+16,e.y+10,14,'#e3ce95');this.shake=2;this.once('stomp','Nice landing! Jump on wind-ups and wandering keys.');}else this.damage();}
  }
  for(const h of this.level.coffees)if(p.x+p.w>h.x+4&&p.x<h.x+h.w-4&&p.y+p.h>h.y-6&&p.y<h.y+10)this.damage();
  for(const c of this.level.clips)if(!c.taken&&Math.abs(p.x+14-c.x)<30&&Math.abs(p.y+18-c.y)<42){c.taken=true;this.clips++;this.audio.play('clip');this.burst(c.x,c.y,9,c.secret?'#fff0ab':'#eec971',true);if(c.secret)this.once('secret','A secret little corner. Good exploring!');}
  for(let i=0;i<this.level.checkpoints.length;i++){const cp=this.level.checkpoints[i];if(i>this.checkpoint&&Math.abs(p.x-cp.x)<55&&Math.abs(p.y+p.h-cp.y)<90){this.checkpoint=i;p.health=3;this.audio.play('checkpoint');this.burst(cp.x,cp.y-65,25,'#e7da92',true);this.hint('Checkpoint saved · A fresh heart for the road.');}}
  const chapter=p.x<4300?0:p.x<9050?1:2;if(chapter!==this.chapter){this.chapter=chapter;$('#section-banner').textContent=`${String(chapter+1).padStart(2,'0')} / ${CHAPTERS[chapter].toLowerCase()}`;$('#section-banner').style.opacity='1';clearTimeout(this.bannerTimer);this.bannerTimer=setTimeout(()=>$('#section-banner').style.opacity='0',2600);}
  if(p.x>1320&&p.x<1520)this.once('eraser','Give the eraser a nudge. Some things are meant to move.');
  if(p.x>2380&&p.x<2640)this.once('coffee','Coffee is a big problem when you’re this small.');
  if(p.x>4220&&p.x<4390)this.once('climb','Up and over. Or take the spring to the scenic route.');
  if(p.x>this.level.finish.x-48&&Math.abs(p.y+p.h-608)<90)this.win();
  const target=Math.max(0,Math.min(WORLD-1280,p.x-440+p.vx*.24));this.camera+=(target-this.camera)*(1-Math.exp(-dt*4));this.updateHud();
 }
 if(this.state!=='paused'){this.time+=dt;for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=180*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);this.shake=Math.max(0,this.shake-dt*18);}
 this.audio.update(this.state==='playing');
 }
 frame(now){const delta=Math.min((now-this.last)/1000,.08);this.last=now;this.accumulator+=delta;while(this.accumulator>=1/120){if(!this.manual)this.step(1/120);this.accumulator-=1/120;}this.renderer.render(this);requestAnimationFrame(t=>this.frame(t));}
}
const game=new Game();
if(new URLSearchParams(location.search).has('test'))window.__game=game;
