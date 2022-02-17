class Vehicle {
    constructor(x,y){
        this.pos = createVector(x,y);
        this.radius = 5;
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(1,8))
        this.acc = createVector(0,0);
        this.maxSpeed = random(5,7);
        this.maxSteer = 0.2;
        this.periVis = false;
    }
    isInsideVision(veh,visionDis){
        let v = p5.Vector.sub(veh.pos,this.pos);
        if(v.mag() <= visionDis &&(v.heading() <= this.vel.heading()+(PI/4) && veh.vel.heading() >= this.vel.heading()-(PI/4))){
            return true;
        }
        return false;
    }
    applyForce(force){
        this.acc.add(force)
    }
    avoidWall(){
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
            return steer
        }
        return createVector(0,0)
    }
    wall(){
        if(this.pos.x<0||this.pos.x>innerWidth){
            this.vel.x*=-1;
        }
        if(this.pos.y<0||this.pos.y>innerHeight){
            this.vel.y*=-1;
        }
    }
    seek(target){
        let desire = p5.Vector.sub(target,this.pos);
        desire.normalize();
        desire.mult(this.maxSpeed);
        let steer = p5.Vector.sub(desire,this.vel);
        steer.limit(this.maxSteer);
        return steer;
    }
    align(){
        let desiredDis = 50;
        let dis,v,avg = createVector(0,0),count = 0;
        for(v of posGrid.lookAtGrid(this.pos)){
            dis = p5.Vector.dist(this.pos,v.pos);
            if(dis>0 && ((this.isInsideVision(v,desiredDis) && this.periVis) || (!this.periVis&&dis<desiredDis))){
                avg.add(v.vel.copy().normalize().div(dis));
                count++;
            }
        }
        if(count >0){
            avg.div(count);
            avg.normalize()
            avg.mult(this.maxSpeed)
            let steer = p5.Vector.sub(avg,this.vel);
            steer.limit(this.maxSteer);
            return steer;
        }
        return createVector(0,0)
    }
    cohesion(){
        let desiredDis = 50;
        let dis,v,avg = createVector(0,0),count = 0;
        for(v of posGrid.lookAtGrid(this.pos)){
            dis = p5.Vector.dist(this.pos,v.pos);
            if(dis>0 && ((this.isInsideVision(v,desiredDis) && this.periVis) || (!this.periVis&&dis<desiredDis))){
                avg.add(p5.Vector.sub(this.pos,v.pos).normalize().div(dis));
                count++;
            }
        }
        if(count >0){
            avg.div(count);
            avg.normalize()
            avg.mult(-1*this.maxSpeed)
            let steer = p5.Vector.sub(avg,this.vel);
            steer.limit(this.maxSteer);
            return steer;
        }
        return createVector(0,0)
    }
    separate(){
        let desiredDis = this.radius*3;
        let dis,v,avg = createVector(0,0),count = 0;
        for(v of posGrid.lookAtGrid(this.pos)){
            dis = p5.Vector.dist(this.pos,v.pos);
            if(dis>0 && dis<desiredDis){
                avg.add(p5.Vector.sub(this.pos,v.pos).normalize().div(dis));
                count++;
            }
        }
        if(count >0){
            avg.div(count);
            avg.normalize()
            avg.mult(this.maxSpeed)
            let steer = p5.Vector.sub(avg,this.vel);
            steer.limit(this.maxSteer);
            return steer;
        }
        return createVector(0,0)
    }
    applyBehaviors(){
        let ali  = this.align()
        let sep = this.separate();
        let coh = this.cohesion()

        this.applyForce(this.avoidWall().mult(1))
        this.applyForce(coh.mult(1))
        this.applyForce(ali.mult(1));
        this.applyForce(sep.mult(2.5));
    }
    draw(){
        push()
        stroke(255)
        fill(255)
        translate(this.pos)
        rotate(this.vel.heading()-radians(90))
        triangle(-this.radius/2,-this.radius,this.radius/2,-this.radius,0,this.radius);
        pop()
    }
    update(){
        this.draw()
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0,0);
    }
}

class PosGrid{
    constructor(resolution){
        this.res = resolution;
        this.array = [];
        this.maxCol = Math.floor(innerWidth/this.res);
        this.maxRow = Math.floor(innerHeight/this.res);
    }
    update(ViewGrid){
        //console.log(this.array.length);
        let i,j,k = 0;
        this.array = [];
        for(i =0;i<Math.floor(innerHeight/this.res);i++){
            this.array.push([])
            if(ViewGrid){
                stroke(50)
                line(0,i*this.res,innerWidth,i*this.res);
            }
            for(j =0;j<Math.floor(innerWidth/this.res);j ++){
                this.array[k].push([]);
            }
            k ++;
        }
        for(j =0;j< Math.floor(innerWidth/this.res) && ViewGrid;j++){
            stroke(50)
            line(j*this.res,0,j*this.res,innerHeight)
        }
        //console.log(this.array,this.array.length);
        let v
        for(v of vehicles){
            i = Math.floor(v.pos.y/this.res);
            j = Math.floor(v.pos.x/this.res);
            //console.log(i,j,this.maxRow,this.maxCol);
            if(i <0|| j<0||i>=this.maxRow || j>=this.maxCol) continue;
            this.array[i][j].push(v);
        }
    } 
    lookAtGrid(pos){
        let i = Math.floor(pos.y/this.res);
        let j = Math.floor(pos.x/this.res);
        if(i>=this.maxRow||i<0||j>=this.maxCol||j<0) return [];
        return this.array[i][j];
    }
}