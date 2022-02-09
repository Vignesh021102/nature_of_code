var vehicles = [];
let range = 40;
let i,x,y;
function setup() {
  createCanvas(innerWidth, innerHeight);
  for(let i =0;i<10;i++){
    x = random(0,innerWidth);
    y = random(0,innerHeight);
    vehicles.push(new Vehicle(x,y))
  }
  angleMode(RADIANS)
}

function draw() {
  background(0);
  
  for(i in vehicles){
    vehicles[i].update()
  }
  
  stroke(255,0,0)
  line(range,range,innerWidth-range,range)
  line(range,range,range,innerHeight-range)
  line(innerWidth-range,range,innerWidth-range,innerHeight-range)
  line(range,innerHeight-range,innerWidth-range,innerHeight-range)
}
