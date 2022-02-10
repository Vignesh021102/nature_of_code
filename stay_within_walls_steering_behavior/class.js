
class Vehicle {
    constructor(x,y){
        this.pos = createVector(x,y);
        this.radius = 10;
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0,0);
        this.maxSpeed = 10;
        this.maxSteer = 0.5;
        this.trailLine = [];
    }
    edges(){
        let range = 40;
        let desire;
        if(this.pos.x < range){
            desire = createVector(this.maxSpeed,this.vel.y);
        }
        if(this.pos.y < range){
            desire = createVector(this.vel.x,this.maxSpeed);
        }
        if(this.pos.x > innerWidth-range){
            desire = createVector(-this.maxSpeed,this.vel.y);
        }
        if(this.pos.y > innerHeight-range){
            desire = createVector(this.vel.x,-this.maxSpeed);
        }
        if(desire){
            desire.normalize();
            desire.mult(this.maxSpeed)
            let steer = p5.Vector.sub(desire,this.vel);
            steer.limit(this.maxSteer);
            this.applyForce(steer);
        }
    }
    wall(){
        if(this.pos.x <= 0 || this.pos.x>= innerWidth){
            this.vel.x *= -1
        }
        if(this.pos.y <= 0 || this.pos.y>= innerHeight){
            this.vel.y *= -1
        }
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
            stroke(255);
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
        fill(255)
        translate(this.pos)
        rotate(this.vel.heading()-radians(90))
        triangle(-this.radius/2,-this.radius,this.radius/2,-this.radius,0,this.radius);
        //circle(0,0,20);
        pop()
    }
    update(){
        //this.wall()
        this.drawTrail();
        this.draw();
        this.edges()
        this.vel.add(this.acc)
        this.pos.add(this.vel);
        
        this.acc.set(0,0)
    }
}
