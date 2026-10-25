export class Audio {
  constructor(){this.enabled=true;this.ctx=null;this.nextNote=0;this.index=0;}
  init(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.17;this.master.connect(this.ctx.destination);}this.ctx.resume();}
  tone(freq,duration=.12,type='sine',volume=.2,delay=0){if(!this.enabled||!this.ctx)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration);}
  play(name){if(!this.ctx)return;const sounds={jump:[330,440],clip:[1047,1568],hurt:[160,100],spring:[440,880],stomp:[160,360],checkpoint:[523,659,784,1047],win:[523,659,784,1047,1318]};(sounds[name]||[]).forEach((f,i)=>this.tone(f,name==='checkpoint'||name==='win'?.4:.15,'sine',.25,i*.075));}
  update(active){if(!active||!this.enabled||!this.ctx)return;const t=this.ctx.currentTime;if(t>this.nextNote){const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23,220,261.63,329.63,392,196,246.94,293.66,0];const f=notes[this.index++%notes.length];if(f){this.tone(f,.7,'sine',.075);if(this.index%4===1)this.tone(f/2,1.4,'triangle',.045);}this.nextNote=t+.43;}}
  toggle(){this.enabled=!this.enabled;if(this.ctx)this.master.gain.value=this.enabled?.17:0;return this.enabled;}
}
