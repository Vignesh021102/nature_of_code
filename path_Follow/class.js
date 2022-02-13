function normalPoint(loc,p1,p2){

    let a = p5.Vector.sub(loc,p1)
    let b = p5.Vector.sub(p2,p1)
    b.normalize();
    b.mult(a.dot(b));
    return p5.Vector.add(p1,b)
}
class Vehicle {
    constructor(x,y){
        this.pos = createVector(x,y);
        this.radius = 5;
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(1,8))
        this.acc = createVector(0,0);
        this.maxSpeed = random(5,7);
        this.maxSteer = 0.2;
    }
    applyForce(force){
        this.acc.add(force)
    }
    seek(target){
        let desire = p5.Vector.sub(target,this.pos);
        desire.normalize();
        desire.mult(this.maxSpeed);
        let steer = p5.Vector.sub(desire,this.vel);
        steer.limit(this.maxSteer);
        this.applyForce(steer)
    }
    followPath(paths){
        let predict = this.vel.copy();
        predict.normalize();
        predict.mult(20);
        predict = p5.Vector.add(this.pos,predict);
        
        let a,b,dis,normal,minNorm,minD = 1000,minPath;
        
        for(let i =0;i<paths.arr.length-1;i++){
            a = paths.arr[i];
            b = paths.arr[i+1]
            normal = normalPoint(predict,paths.arr[i],paths.arr[i+1])
            if(normal.x<min(a.x,b.x) || normal.x>max(a.x,b.x)){
                normal = a.copy();
            }
            dis = p5.Vector.dist(predict,normal);
            if(dis<minD || !minD){
                minD = dis;
                minNorm = normal;
                minPath = paths.arr[i+1].copy()
            }
        }
        
        push()
        stroke(255,0,0,80)
        line(this.pos.x,this.pos.y,minNorm.x,minNorm.y)
        pop()

        if(minD>paths.radius){
            this.seek(minNorm)
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
        //this.drawTrail();
        this.draw()
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0,0);
    }
}

class Path{
    constructor(radius){
        this.radius = radius;
        this.arr = []
    }
    path(){
        let r = MIN/4;
        let center = createVector(innerWidth/2,innerHeight/2)
        for(let i = 0;i<PI*2;i+=PI/6){
            this.arr.push(p5.Vector.add(center,createVector(cos(i)*r,sin(i)*r)))
        }
    }
    addPath(point){
        this.arr.push(point)
        if(this.arr.length >10) this.arr.shift();
    }
    draw(){
        push()
        stroke(100)
        strokeWeight(this.radius*2);
        noFill()
        beginShape()
        for(let i =0;i<this.arr.length;i++){
            vertex(this.arr[i].x,this.arr[i].y)
        }
        endShape()
        stroke(0)
        strokeWeight(2);
        noFill()
        beginShape()
        for(let i =0;i<this.arr.length;i++){
            vertex(this.arr[i].x,this.arr[i].y)
        }
        endShape()
        stroke(100)
        strokeWeight(1)
        fill(0)
        for(let i =0;i<this.arr.length;i++){
            circle(this.arr[i].x,this.arr[i].y,5)
        }
        pop()
    }
}