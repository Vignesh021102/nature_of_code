var vehicles = [];
var flowField;

let i,x,y;
function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(RADIANS);
  flowField = new FlowField(20)
  flowField.Initarr()
  for(let i =0;i<(innerWidth>innerHeight?innerWidth/10:innerHeight/10);i++){
    x = random(0,innerWidth);
    y = random(0,innerHeight);
    vehicles.push(new Vehicle(x,y))
  }
}

function draw() {
  background(0);
  flowField.draw()
  for(i in vehicles){
    vehicles[i].update()
      vehicles[i].flow(flowField.res)
  }
}
