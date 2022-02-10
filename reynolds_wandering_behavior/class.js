
class Vehicle {
    constructor(x,y){
        this.pos = createVector(x,y);
        this.radius = 10;
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(1,3))
        this.acc = createVector(0,0);
        this.maxSpeed = 1;
        this.maxSteer = 0.2;
        this.trailLine = [];
        this.wanderAngle = 0;
    }
    wall(){
        if(this.pos.x <= 0 ){
            this.pos.x = 0;
            this.vel.x *= -1
        }
        if(this.pos.x>= innerWidth){
            this.pos.x = innerWidth;
            this.vel.x*=-1
        }
        if(this.pos.y <= 0 ){
            this.pos.y = 0;
            this.vel.y *= -1
        }
        if(this.pos.y>= innerHeight){
            this.pos.y = innerHeight;
            this.vel.y*=-1
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
    wander(draw){
        let angle = this.vel.heading();
        let range = 20;
        let dir = createVector(Math.cos(angle),Math.sin(angle))
        dir.mult(50)
        this.wanderAngle += random(-PI/16,PI/16);
        let desire = createVector(Math.cos(this.wanderAngle),Math.sin(this.wanderAngle));
        desire.mult(range);
        if(draw){
            push()
            stroke(255,0,0)
            line(this.pos.x,this.pos.y,this.pos.x+dir.x,this.pos.y+dir.y)
            circle(this.pos.x+dir.x,this.pos.y+dir.y,range*2)
            fill(255)
            circle(this.pos.x+dir.x+desire.x,this.pos.y+dir.y+desire.y,5)
            pop()
        }
        
        let steer = p5.Vector.sub(desire,this.vel).limit(this.maxSteer);
        this.applyForce(steer)
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
        this.wall()
        this.drawTrail();
        this.wander(true)
        this.draw();
        this.vel.add(this.acc)
        this.pos.add(this.vel);
        
        this.acc.set(0,0)
    }
}