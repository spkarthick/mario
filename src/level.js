export const WORLD = 14500;
export const FLOOR = 608;
export const CHAPTERS = ['STATIONERY TRAIL', 'THE GREAT BOOK CLIMB', 'AFTER HOURS'];
export function makeLevel() {
  const platforms=[], clips=[], enemies=[], springs=[], checkpoints=[{x:4050,y:608},{x:8900,y:608}], erasers=[], seesaws=[], coffees=[];
  const holes = [[1780,1910],[3200,3360],[6880,7030],[7750,7910],[9660,9810],[10850,11020],[12140,12300],[13330,13480]];
  let start=0;
  for(const [a,b] of [...holes,[WORLD,WORLD]]) { platforms.push({x:start,y:FLOOR,w:a-start,h:170,type:'desk'});start=b; }
  const book=(x,y,w,h,color,label='FIELD NOTES')=>platforms.push({x,y,w,h,type:'book',color,label});
  const note=(x,y,w=140,h=34)=>platforms.push({x,y,w,h,type:'notes',color:'#e6c86c'});
  const pencil=(x,y,w=225)=>platforms.push({x,y,w,h:16,type:'pencil'});
  const row=(x,y,n=4,space=35,secret=false)=>{for(let i=0;i<n;i++)clips.push({x:x+i*space,y,secret,taken:false});};
  // Chapter one: generous practice space before the first gap.
  note(650,555,150,53);book(855,498,200,110,'#759b86','LITTLE IDEAS');note(1130,544,160,64);
  erasers.push({x:1415,y:566,w:72,h:42,vx:0,home:1415});
  pencil(1740,589,230);book(2140,534,220,74,'#c9795b','THE EVERYDAY');
  seesaws.push({x:2550,y:537,w:290,h:16,angle:0});
  note(2850,524,170,84);springs.push({x:3140,y:608});
  pencil(3190,530,185);note(3470,515,180,93);book(3690,548,160,60,'#68999a','DAYDREAMS');
  row(390,555,5);row(690,510,3);row(900,453,4);row(1775,542,5);row(2180,489,4);row(2600,475,5);row(3220,485,4);row(3510,470,3);
  // An optional upper shelf, reached using the spring clip.
  pencil(2960,420,210);note(3235,330,150,34);row(3265,285,3,32,true);
  coffees.push({x:2440,y:608,w:115});
  enemies.push({x:2270,y:510,w:32,h:24,type:'toy',min:2145,max:2320,vx:44});
  enemies.push({x:3780,y:578,w:30,h:30,type:'key',min:3880,max:3980,vx:34});
  // Chapter two: books become a readable staircase, then an elevated traverse.
  book(4450,550,215,58,'#b7795b','COLLECTED THOUGHTS');
  book(4680,480,210,128,'#669794','AN ATLAS OF SMALL THINGS');
  book(4910,410,210,198,'#c0a261','SUNDAY STORIES');
  book(5140,340,220,268,'#6c806a','THE ART OF GETTING LOST');
  book(5390,270,300,338,'#a76150','A VERY BIG WORLD');
  pencil(5680,286,220);book(5915,340,220,268,'#649496','POCKET EXPLORER');
  note(6200,421,180,187);book(6440,495,210,113,'#b98a65','ON THE WAY HOME');
  note(6710,550,125,58);pencil(6850,578,220);
  springs.push({x:7160,y:608});note(7310,445,170,163);pencil(7520,490,210);pencil(7730,555,230);
  seesaws.push({x:8090,y:548,w:300,h:16,angle:0});note(8470,532,165,76);
  for(const [x,y,n] of [[4490,507,4],[4710,437,4],[4940,367,4],[5175,297,4],[5440,227,6],[5730,243,3],[5955,297,4],[6240,378,3],[6480,452,4],[6895,531,4],[7350,402,3],[7780,508,4],[8130,492,5]]) row(x,y,n);
  // Secret stepping route above the ordinary climb.
  note(4550,390,170,28);pencil(4820,300,185);note(5060,220,155,28);row(5090,175,3,35,true);
  springs.push({x:4380,y:608});
  enemies.push({x:5480,y:246,w:32,h:24,type:'toy',min:5405,max:5635,vx:52});
  enemies.push({x:6500,y:465,w:30,h:30,type:'key',min:6460,max:6610,vx:40});
  coffees.push({x:7980,y:608,w:100});
  // Chapter three: the desk meets the keyboard and its looping cables.
  note(9230,550,155,58);book(9435,490,165,118,'#698f88','AFTER HOURS');
  pencil(9640,502,215);note(9910,547,150,61);
  // The tape dispenser is a convex obstacle with physical stair steps.
  platforms.push({x:10210,y:563,w:60,h:45,type:'tapePart'});
  platforms.push({x:10270,y:507,w:60,h:101,type:'tapePart'});
  platforms.push({x:10330,y:454,w:180,h:154,type:'tapePart'});
  platforms.push({x:10510,y:520,w:95,h:88,type:'tapePart'});
  pencil(10820,568,230);springs.push({x:11200,y:608});
  note(11370,442,160,166);pencil(11570,462,200);
  book(11830,513,220,95,'#a97766','ONE LAST THING');pencil(12115,537,230);
  seesaws.push({x:12480,y:526,w:280,h:16,angle:0});note(12800,510,160,98);
  note(13050,544,150,64);pencil(13300,563,220);book(13620,544,220,64,'#6e958a','THE END IS A BEGINNING');
  for(const [x,y,n] of [[9270,507,3],[9465,447,3],[9670,459,5],[9960,504,2],[10360,409,4],[10865,521,4],[11400,399,3],[11610,419,3],[11870,470,4],[12155,490,4],[12525,468,5],[12835,467,3],[13345,516,4],[13655,501,4],[14000,550,3]])row(x,y,n);
  coffees.push({x:10650,y:608,w:125},{x:11700,y:608,w:90},{x:12980,y:608,w:62});
  enemies.push({x:10000,y:517,w:30,h:30,type:'key',min:9920,max:10020,vx:45},{x:11900,y:489,w:32,h:24,type:'toy',min:11840,max:12010,vx:62},{x:13100,y:514,w:30,h:30,type:'key',min:13060,max:13165,vx:48},{x:13880,y:578,w:32,h:24,type:'toy',min:13850,max:14020,vx:54});
  return {platforms,clips,enemies,springs,checkpoints,erasers,seesaws,coffees,holes,finish:{x:14210,y:608},tape:{x:10210,y:608}};
}
