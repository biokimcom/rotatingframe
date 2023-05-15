var cirX = 400;
var cirY = 350;
var cirR = 200;
var sliderv;
var launchb = false;
var cur_ang_inner = 0;
let cur_ang_outer = 0;
let innerObj, outerObj;
let launch_ang;
let dx = 0;
let angV_inner, angV_outer;
let noninertial = false;
let dtheta = 0;
let history =[];

function setup() {
  
    createCanvas(800,700);
   
    var drawButton1 = createButton("Launch");
    drawButton1.position(500, 80);
    drawButton1.mousePressed(Launchf);
    
    var drawButton2 = createButton("Reload");
    drawButton2.position(500, 50);
    drawButton2.mousePressed(Reloadf);
  
    slider_angv = createSlider(0, 0.02, 0.002, 0.001);
    slider_angv.position(20, 50);
    slider_angv.style('width','120px');
  
    slider_bv = createSlider(0, 5, 2, 0.1);
    slider_bv.position(20, 80);
    slider_bv.style('width','120px');
    
    checkbox = createCheckbox('Non-inertial reference frame',false);
    checkbox.position(170,60);
    checkbox.changed(NoninertialFrame);
    
    innerObj = new makeObject(width/2, height/2, 2*cirR);
    outerObj = new makeObject(width/2, height/2, 1200);
    
    //launchObj = new makeObject(innerObj.x+cirR, innerObj.y, 30);
}

function Launchf() {
  launchb = true;
  launch_ang = cur_ang_inner;
}

function Reloadf() {
  launchb = false;
  dtheta = 0;
  history = [];
}

function NoninertialFrame() {
  if (checkbox.checked()) {
    noninertial = true;
  } else {
    noninertial = false;
  }
}

function draw() {
    background(245);
    let tx, ty;

    angV= slider_angv.value();

    if (!noninertial) {
      //inertial frame
      outerObj.angularSpd(0);
      outerObj.display(100,3,'white');
  
      innerObj.angularSpd(angV);
      innerObj.display(0,2,'rgb(216,234,200)');
      cur_ang_inner = innerObj.ang;
    } else {
      //non-inertial fram
      outerObj.angularSpd(-angV);
      outerObj.display(100,3,'white');
  
      innerObj.angularSpd(0);
      innerObj.display(0,2,'rgb(216,234,200)');
      cur_ang_outer = outerObj.ang;
    }

    strokeWeight(0.5); stroke(0);
    textSize(10);
    fill(0,0,0);
    text('Angular Speed',30,45);
    text('Ball Speed',30,80);
    textSize(18);
    text('[This is a top view] A ball is thrown from the edge of the disk inward.',10,600);
    text('The ball moves through the air without touching the disk.',10,620);
    textSize(10);
    text('Programmed by Seung-Jae Kim using p5.Js',10,650);
  
    push();
    translate(width/2,height/2);
    
    if (launchb == true) {
      if (!noninertial) {     
        tx=(cirR-15+dx)*cos(launch_ang);
        ty=(cirR-15+dx)*sin(launch_ang);
        history.push(createVector(tx,ty));
      } else {
        tx=(cirR-15+dx)*cos(cur_ang_inner-dtheta);
        ty=(cirR-15+dx)*sin(cur_ang_inner-dtheta);
        history.push(createVector(tx,ty));
      }

      dx = dx - slider_bv.value();  
      dtheta = dtheta - slider_angv.value();
      for (var i=0;i<history.length-1;i++){
        let pos1 = history[i];
        let pos2 = history[i+1];
        stroke(50,50,50,i); strokeWeight(2);
        line(pos1.x,pos1.y,pos2.x,pos2.y);
      }
      if (history.length>50) {
        history.splice(0, 1);
      }
      
    } else {
        tx = (cirR-15)*cos(cur_ang_inner);
        ty = (cirR-15)*sin(cur_ang_inner);

        //history.push(createVector(tx,ty));
        dx = 0 ;
    }
    fill('#9C27B0'); stroke(0); strokeWeight(3);
    circle(tx,ty,30);
  

    pop();
    
}

class makeObject {
    constructor(px,py,pd) {
        this.x = px;
        this.y = py;
        this.d = pd;
        this.ang = 0;
    }
    
    angularSpd(angv){
        this.ang = this.ang + angv;
    }
    
    display(pstroke,pstrokeweight,clr){
      stroke(pstroke);
      strokeWeight(pstrokeweight);
      fill(clr);
      
      var p0 = createVector(this.x,this.y);
      var pu = createVector(0,-this.d/2);
      var pd = createVector(0,this.d/2);
      var pl = createVector(-this.d/2,0);
      var pr = createVector(this.d/2,0);
        
      push();
      translate(this.x,this.y);
      rotate(this.ang);
      
      circle(0,0,this.d);
      line(pu.x, pu.y, pd.x, pd.y);
      line(pl.x, pl.y, pr.x, pr.y);
      rectMode(CENTER);
      fill('rgb(104,166,102)');
      rect(pr.x, pr.y, 40, 40);
      pop();
    }
}
