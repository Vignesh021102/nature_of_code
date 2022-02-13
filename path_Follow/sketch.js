var vehicles = [];
let paths ;
let MIN = innerWidth<innerHeight?innerWidth:innerHeight;
let i,x,y;
function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(RADIANS);
  
  for(let i =0;i<MIN/10;i++){
    x = random(0,innerWidth);
    y = random(0,innerHeight);
    vehicles.push(new Vehicle(x,y))
  }
  paths = new Path(10);
  paths.path()
  document.body.addEventListener("click",()=>{
    paths.addPath(createVector(mouseX,mouseY))
  })
}

function draw() {
  background(0);
  paths.draw()
  for(i in vehicles){
    vehicles[i].update()
    vehicles[i].followPath(paths)
  }
}
