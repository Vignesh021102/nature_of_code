var vehicles = [];
var posGrid;
let MAX= innerWidth>innerHeight?innerWidth:innerHeight;
let i,x,y;
function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(RADIANS);
  
  for(let i =0;i<MAX/2;i++){
    x = random(0,innerWidth);
    y = random(0,innerHeight);
    vehicles.push(new Vehicle(x,y))
  }
  posGrid = new PosGrid(100)
}

function draw() {
  background(0);
  posGrid.update()
  for(v of vehicles){
    v.applyBehaviors()
    v.update();
  }

}
