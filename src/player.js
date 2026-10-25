export const MOVE={speed:300,jump:620,gravity:1550,accel:2100,friction:2500};
export function createPlayer(x=170,y=564){return {x,y,w:28,h:44,vx:0,vy:0,grounded:false,coyote:0,buffer:0,invincible:0,facing:1,health:3,animation:0,squash:0,on:null,controlledJump:false};}
const approach=(a,b,s)=>a<b?Math.min(a+s,b):Math.max(a-s,b);
export function updatePlayer(g,dt){
 const p=g.player,k=g.keys; p.invincible=Math.max(0,p.invincible-dt);p.squash=Math.max(0,p.squash-dt*4);
 const dir=(k.has('ArrowRight')||k.has('KeyD')?1:0)-(k.has('ArrowLeft')||k.has('KeyA')?1:0);
 p.vx=approach(p.vx,dir*MOVE.speed,(dir?MOVE.accel:MOVE.friction)*dt);if(dir)p.facing=dir;
 p.animation+=dt*(Math.abs(p.vx)/35+1);p.buffer=Math.max(0,p.buffer-dt);p.coyote=p.grounded?.11:Math.max(0,p.coyote-dt);
 if(p.buffer>0&&p.coyote>0){p.vy=-MOVE.jump;p.controlledJump=true;p.grounded=false;p.coyote=0;p.buffer=0;p.on=null;g.audio.play('jump');g.burst(p.x+14,p.y+44,6,'#eee1ba');}
 const jumpHeld=k.has('Space')||k.has('KeyW')||k.has('ArrowUp');
 p.vy+=MOVE.gravity*dt*(p.vy<0&&p.controlledJump&&!jumpHeld?2.35:1);p.vy=Math.min(p.vy,900);
 const solids=[...g.level.platforms,...g.level.erasers.map(e=>({...e,type:'eraser',source:e}))];
 p.x+=p.vx*dt;p.x=Math.max(0,p.x);
 for(const s of solids){if(s.type==='pencil')continue;if(overlap(p,s)){
  let pushed=false;if(s.type==='eraser'&&p.y+p.h>s.y+8){const e=s.source;const dx=p.vx*dt;const candidate={...e,x:e.x+dx};if(!g.level.platforms.some(b=>b.type!=='desk'&&b.type!=='pencil'&&overlap(candidate,b))){e.x+=dx;s.x=e.x;pushed=true;}}
  if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;if(!pushed)p.vx=0;
 }}
 const oldBottom=p.y+p.h;p.y+=p.vy*dt;p.grounded=false;p.on=null;
 for(const s of solids){if(p.x+p.w<=s.x||p.x>=s.x+s.w)continue;
  if(p.vy>=0&&oldBottom<=s.y+5&&p.y+p.h>=s.y){const impact=p.vy;p.y=s.y-p.h;p.vy=0;p.grounded=true;p.on=s;
   if(impact>180){p.squash=.7;g.burst(p.x+14,s.y,7,'#f0dfb6');if(impact>650)g.shake=3;}
  }else if(s.type!=='pencil'&&p.vy<0&&overlap(p,s)&&p.y<s.y+s.h&&oldBottom-p.h>=s.y+s.h-6){p.y=s.y+s.h;p.vy=0;}
 }
 for(const s of g.level.seesaws){const cx=s.x+s.w/2;const target=p.x+p.w>s.x&&p.x<s.x+s.w&&Math.abs(p.y+p.h-s.y)<70?((p.x+14-cx)/(s.w/2))*.18:0;s.angle+=(target-s.angle)*Math.min(dt*3,1);const surface=s.y+(p.x+14-cx)*Math.sin(s.angle);if(p.x+p.w>s.x&&p.x<s.x+s.w&&p.vy>=0&&oldBottom<=surface+12&&p.y+p.h>=surface-5){p.y=surface-p.h;p.vy=0;p.grounded=true;p.on=s;}}
 for(const e of g.level.erasers){e.vy=(e.vy||0)+MOVE.gravity*dt;const old=e.y+e.h;e.y+=e.vy*dt;for(const s of g.level.platforms)if(e.x+e.w>s.x&&e.x<s.x+s.w&&old<=s.y+3&&e.y+e.h>=s.y){e.y=s.y-e.h;e.vy=0;}if(e.y>850){e.x=e.home;e.y=566;e.vy=0;}}
 for(const s of g.level.springs)if(Math.abs(p.x+14-s.x)<32&&p.y+p.h>=s.y-12&&oldBottom<=s.y+12&&p.vy>=0){p.vy=-870;p.controlledJump=false;p.grounded=false;p.coyote=0;s.bounce=1;g.audio.play('spring');g.burst(s.x,s.y,14,'#d8e9d1');g.hint('A little spring in your step!');}
 if(p.y>820)g.damage(true);
}
export function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
