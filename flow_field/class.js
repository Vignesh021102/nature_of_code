
class Vehicle {
    constructor(x,y){
        this.pos = createVector(x,y);
        this.radius = 5;
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(1,8))
        this.acc = createVector(0,0);
        this.maxSpeed = 1;
        this.maxSteer = 0.2;
        this.trailLine = [];
    }
    isExited(){
        if(this.pos.x <= 0 ){
            return true;
        }
        if(this.pos.x>= innerWidth){
            return true;
        }
        if(this.pos.y <= 0 ){
            return true;
        }
        if(this.pos.y>= innerHeight){
            return true;
        }
    }
    flow(res){
        let i = Math.floor(this.pos.y/res);
        let j = Math.floor(this.pos.x/res);
        if(j >=flowField.arr[0].length||i>=flowField.arr.length) return;
        let desire = flowField.arr[i][j];
        
        desire.mult(this.maxSpeed);
        let steer = p5.Vector.sub(desire,this.vel);
        steer.mult(this.maxSteer);
        this.applyForce(steer);
    }
    applyForce(force){
        this.acc.add(force)
    }
    drawTrail(){
        this.trailLine.unshift(createVector(this.pos.x,this.pos.y))
        if(this.trailLine.length >= 100){
            this.trailLine.pop();
        }
        if(this.trailLine.length > 2){
            stroke(100);
            noFill()
            beginShape()
            for(let i =0;i<this.trailLine.length;i++){
                curveVertex(this.trailLine[i].x,this.trailLine[i].y)
            }
            endShape()
        }
    }
    draw(){
        push()
        stroke(255)
        fill(100)
        translate(this.pos)
        rotate(this.vel.heading()-radians(90))
        triangle(-this.radius/2,-this.radius,this.radius/2,-this.radius,0,this.radius);
        //circle(0,0,20);
        pop()
    }
    update(){
        this.drawTrail();
        this.draw();
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0,0);
        if(this.isExited()){
            this.pos.x = random(10,innerWidth-10);
            this.pos.y = random(10,innerHeight-10)
            this.trailLine = [];
        }
    }
}

class FlowField{
    constructor(resolution){
        this.arr = [];
        this.res = resolution;
    }
    Initarr(){
        let xoff = 0,yoff=0,diff = random(0.05,0.2)
        for(let i =0;i<Math.floor(innerHeight/this.res);i++){
            this.arr.push([])
            yoff = 0;
            for(let j =0;j<Math.floor(innerWidth/this.res);j++){
                let angle = map(noise(xoff,yoff),0,1,0,TWO_PI)
                this.arr[i].push(createVector(cos(angle),sin((angle))));
                yoff+=diff;
            }
            xoff+=diff;
        }
        this.draw();
    }
    draw(){
        stroke(30)
        for (let i = 1; i < Math.floor(innerWidth/this.res); i++) {
            line(i*this.res,0,i*this.res,innerHeight)
        }
        for (let i = 1; i < Math.floor(innerHeight/this.res); i++) {
            line(0,i*this.res,innerWidth,i*this.res)
        }
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                let radius = this.res/4
                push()
                stroke(30)
                fill(30)
                translate((j*this.res)+(this.res/2),(i*this.res)+(this.res/2));
                line(-this.arr[i][j].x*(this.res/2),-this.arr[i][j].y*(this.res/2),this.arr[i][j].x*(this.res/2),this.arr[i][j].y*(this.res/2));
                translate(this.arr[i][j].x*(this.res/4),this.arr[i][j].y*(this.res/4))
                rotate(this.arr[i][j].heading()-radians(90))
                triangle(-radius/2,-radius,radius/2,-radius,0,radius);
                pop()
            }
        }
    }
}