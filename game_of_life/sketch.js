var grid;
var bool = true;
function setup() {
  let res = 10;
  let r = Math.floor(innerHeight/res)
  let c = Math.floor(innerWidth/res)
 createCanvas(innerWidth,innerHeight);
  grid = new Grid(res*c,res*r,res)
  grid.initArr()
  document.body.addEventListener("keydown",(event)=>{
    if(event.code == "Space"){
      console.log(`isPaused: ${bool}`);
     if(!bool){
       bool = true;
     }else{
       bool = false;
     }
    }
  })
  document.body.addEventListener("click",(event)=>{
    let col = Math.floor(mouseX/res);
    let row = Math.floor(mouseY/res);
    if(grid.arr[row][col]) return grid.arr[row][col] = false;
    grid.arr[row][col] = true;
  })
}

function draw() {
  background(0);
  grid.draw()
  background(0);
  if(bool){
    grid.check()
  }
  grid.draw()
}


class Grid{
  constructor(width,height,res){
    this.width = width;
    this.height = height;
    this.row = Math.floor(height/res);
    this.col = Math.floor(width/res);
    this.res = res
    this.arr = [];
    this.next = [];
  }
  initArr(){
    for(let i = 0;i<this.height;i+= this.res){
      this.arr.push([])
      for(let j =0;j<this.width;j+= this.res){
        this.arr[Math.floor(i/this.res)].push(parseInt(random(2)))
      }
    }
    for(let i = 0;i<this.height;i+= this.res){
      this.next.push([])
      for(let j =0;j<this.width;j+= this.res){
        this.next[Math.floor(i/this.res)].push(0)
      }
    }
    this.row = this.arr.length;
    this.col = this.arr[0].length
    console.log(this.row,this.col);
    
  }
  check(){
    let a,b,i,j,count = 0;
    this.next = [];
    for(let i = 0;i<this.height;i+= this.res){
      this.next.push([])
      for(let j =0;j<this.width;j+= this.res){
        this.next[Math.floor(i/this.res)].push(0)
      }
    }
    for(i =1;i<this.arr.length-1;i++){
      for(j =1;j<this.arr[i].length-1;j++){
        count = 0;
        for(a =-1;a<2;a++){
          for(b = -1;b<2;b++){
            count += this.arr[a+i][b+j]
          }
        }
        count -= this.arr[i][j]
  
        if(this.arr[i][j] == 1 && count >3) this.next[i][j] = 0;
        else if(this.arr[i][j] == 1 && count <2) this.next[i][j] = 0;
        else if(this.arr[i][j] == 0 && count ==3) this.next[i][j] = 1;
        else this.next[i][j] = this.arr[i][j]
      }
    }
    this.arr = [...this.next]
  }
  draw(){
    let r = this.res;
    push()
    stroke(50)
    fill(255)
    for(let i = 0;i<this.arr.length;i++){
      for(let j =0;j<this.arr[i].length;j++){
        //top
        line(j*r,i*r,(j*r)+r,i*r)
        //right
        line((j*r)+r,i*r,(j*r)+r,(i*r)+r)
        //bottom
        line(j*r,(i*r)+r,(j*r)+r,(i*r)+r)
        //left
        line(j*r,i*r,j*r,(i*r)+r)
        if(this.arr[i][j] == 1){
          rect(j*r,i*r,r,r)
        }
      }
    }
    pop()
  }
}
