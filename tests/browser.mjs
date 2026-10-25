import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1050}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://127.0.0.1:3000/?test=1');
 await page.screenshot({path:'/tmp/desktop-adventure-title.png'});
 assert.match(await page.locator('h1').innerText(),/Desktop\s+Adventure/);
 await page.click('#play');await page.evaluate(()=>{__game.manual=true;});
 const results=await page.evaluate(()=>{
  const g=__game,results=[];const check=(name,fn)=>{try{if(!fn())throw Error('assertion failed');results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:e.message});}};
  const tick=(n=1)=>{for(let i=0;i<n;i++)g.step(1/120);};
  const reset=(x=170,y=564)=>{g.reset();g.manual=true;Object.assign(g.player,{x,y,vx:0,vy:0,invincible:0,grounded:false});tick(2);};
  reset();g.keys.add('ArrowRight');tick(60);check('running acceleration and solid floor',()=>g.player.x>290&&g.player.grounded&&g.player.y===564);g.keys.clear();tick(40);check('friction stops running',()=>g.player.vx===0);
  reset();g.keys.add('Space');g.player.buffer=.14;let full=564;for(let i=0;i<90;i++){tick();full=Math.min(full,g.player.y);}reset();g.player.buffer=.14;let short=564;for(let i=0;i<90;i++){tick();short=Math.min(short,g.player.y);}check('variable jump height',()=>short-full>45&&full<450);
  reset(1750);g.player.x=1779;g.player.vx=300;g.keys.add('ArrowRight');tick(3);check('walk off edge',()=>!g.player.grounded&&g.player.coyote>0);g.player.buffer=.14;g.keys.add('Space');tick();check('coyote jump',()=>g.player.vy< -500);
  reset(300,500);g.player.vy=350;tick(8);g.player.buffer=.14;g.keys.add('Space');tick(18);check('jump buffer before landing',()=>g.player.vy<0&&g.player.y<550);
  reset(622);g.keys.add('ArrowRight');tick(60);check('solid side collision',()=>g.player.x<=622.01);
  reset(1380);g.keys.add('ArrowRight');tick(60);check('eraser can be pushed',()=>g.level.erasers[0].x>1450);
  reset(3126);tick(2);check('spring boost',()=>g.player.vy< -700&&!g.player.grounded);
  g.reset();Object.assign(g.player,{x:3126,y:564});tick();g.keys.add('ArrowLeft');let shelf=false;for(let i=0;i<135;i++){if(g.player.x<3070)g.keys.delete('ArrowLeft');tick();if(g.player.grounded&&g.player.on?.y===420){shelf=true;break;}}check('spring reaches optional shelf without holding jump',()=>shelf);if(shelf){g.keys.add('ArrowRight');tick(24);g.player.buffer=.14;g.keys.add('Space');tick(100);}check('optional secret route is reachable and collectible',()=>g.level.clips.filter(c=>c.secret&&c.taken).length===3);
  reset(2650,480);tick(30);check('ruler seesaw responds to weight',()=>Math.abs(g.level.seesaws[0].angle)>.01&&g.player.grounded);
  reset();let e=g.level.enemies[0];Object.assign(g.player,{x:e.x,y:e.y-g.player.h-3,vy:240});tick(4);check('wind-up stomp',()=>e.dead&&g.player.vy<0&&g.player.health===3);
  reset();e=g.level.enemies[1];e.phase=0;Object.assign(g.player,{x:e.min,y:e.base-g.player.h-5,vy:260});tick(6);check('keyboard key stomp',()=>e.dead&&g.player.vy<0);
  reset();const hp=g.player.health;g.damage();g.damage();check('damage grants invulnerability',()=>g.player.health===hp-1&&g.player.invincible>1);
  reset(4050);check('checkpoint activates and heals',()=>g.checkpoint===0&&g.player.health===3);g.player.y=900;tick();check('fall respawns at checkpoint',()=>g.player.x===4065&&g.player.y<608&&g.player.health===2);
  g.player.health=1;g.player.invincible=0;g.damage();check('death restores three hearts at checkpoint',()=>g.player.health===3&&g.player.x===4065&&g.deaths===1);
  reset();const clip=g.level.clips[0];Object.assign(g.player,{x:clip.x-14,y:clip.y-18});tick();check('paper clip collection',()=>clip.taken&&g.clips===1);
  reset(2450);tick();check('coffee damage',()=>g.player.health===2);
  reset();g.pause();const t=g.elapsed,x=g.player.x;g.keys.add('ArrowRight');tick(60);check('pause freezes simulation',()=>g.elapsed===t&&g.player.x===x&&g.state==='paused');g.resume();check('resume clears held inputs',()=>g.state==='playing'&&g.keys.size===0);
  reset(8900);tick();check('second checkpoint',()=>g.checkpoint===1);g.reset();check('restart resets level state',()=>g.checkpoint===-1&&g.clips===0&&g.player.health===3&&g.level.enemies.every(e=>!e.dead));
  return results;
 });
 for(const r of results){console.log(`${r.passed?'PASS':'FAIL'} ${r.name}`);}assert.ok(results.every(r=>r.passed),'Mechanics failed');
 // Exercise the actual DOM keyboard listeners, including simultaneous keys.
 await page.keyboard.down('KeyD');await page.keyboard.down('Space');await page.evaluate(()=>{for(let i=0;i<30;i++)__game.step(1/120);});
 assert.ok(await page.evaluate(()=>__game.player.x>200&&__game.player.vy<0));await page.keyboard.up('Space');await page.keyboard.up('KeyD');
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>__game.state),'paused');await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>__game.state),'playing');await page.keyboard.press('KeyR');assert.equal(await page.evaluate(()=>__game.player.x),170);console.log('PASS keyboard movement + jump, Escape, R');
 // Continuous input-driven traversal. No position changes or stat overrides after reset.
 const route=await page.evaluate(()=>{
  const g=__game;g.reset();g.manual=true;let max=0,falls=0,stuck=0,lastX=0;const chapters=new Set(),checkpoints=new Set(),visited=new Set();
  for(let i=0;i<120*180&&g.state==='playing';i++){
   const p=g.player,b=p.y+p.h;g.keys.add('ArrowRight');g.keys.add('Space');let jump=false;
   for(const s of [...g.level.platforms,...g.level.erasers])if(s.type!=='desk'&&s.x-(p.x+p.w)<65&&s.x+s.w>p.x&&s.y<b-12&&s.y>b-170)jump=true;
   for(const h of g.level.coffees)if(h.x-p.x<105&&h.x+h.w>p.x&&b>h.y-200)jump=true;
   for(const e of g.level.enemies)if(!e.dead&&e.x-p.x<100&&e.x+e.w>p.x&&Math.abs(e.y+e.h-b)<65)jump=true;
   for(const [a,z]of g.level.holes)if(a-p.x<85&&z>p.x&&b>580)jump=true;
   if(jump&&p.grounded)p.buffer=.14;
   const before=p.x;g.step(1/120);if(p.x<before-100)falls++;max=Math.max(max,p.x);chapters.add(g.chapter);checkpoints.add(g.checkpoint);if(p.on?.type)visited.add(p.on.type);
   if(i%120===0){if(Math.abs(p.x-lastX)<5)stuck++;else stuck=0;lastX=p.x;if(stuck>5)break;}
  }
  return {state:g.state,max,falls,seconds:g.elapsed,health:g.player.health,clips:g.clips,secrets:g.level.clips.filter(c=>c.secret&&c.taken).length,chapters:[...chapters],checkpoints:[...checkpoints],surfaces:[...visited]};
 });
 console.log('Full route:',route);assert.equal(route.state,'won');assert.equal(route.falls,0);assert.equal(route.chapters.length,3);assert.ok(route.checkpoints.includes(1));assert.ok(route.clips>30);await page.screenshot({path:'/tmp/desktop-adventure-victory.png'});
 await page.click('#replay');assert.equal(await page.evaluate(()=>__game.state),'playing');assert.equal(await page.evaluate(()=>__game.clips),0);console.log('PASS victory and replay');
 await page.click('#sound');assert.equal(await page.evaluate(()=>__game.audio.enabled),false);await page.click('#sound');assert.equal(await page.evaluate(()=>__game.audio.enabled),true);console.log('PASS sound toggle');
 assert.deepEqual(errors,[]);console.log('PASS no browser errors');
} finally {await browser.close();}
