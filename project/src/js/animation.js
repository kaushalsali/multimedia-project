
class AnimationManager {
    constructor(x, y, size){
      this.x = x;
      this.y = y;
      this.size = size - 20;

      // Create an instance of each object for each node
      this.lightning = new Lightning();
      this.expandingCircle = new ExpandingCircle(this.size, 1.5);
      this.circleStrobe = new CircleStrobe(this.x,this.y,this.size);
      this.circleFade = new CircleFade(this.x,this.y,this.size);
    }

    draw(currentPlaying) {
      //eval(ANIM_MAPPING[currentPlaying]);

      // If statement is temporary while testing functions and
      // different color sets. Eventually, implement the commented
      // out line above.
      if (currentPlaying === 'C4'){
        push();
        this.lightning.draw();
        pop();
      }
      if (currentPlaying === 'D4'){
        this.expandingCircle.draw();
      }
      else if (currentPlaying === 'E4'){
        this.circleStrobe.draw(COLOR_BLUES[1]);
      }
      else if (currentPlaying === 'F4') {
        this.circleFade.draw("light", true, COLOR_ORANGE);
      }
    }
}



class Lightning {
  constructor() {
    this.trail = [];
    this.maxVal = 15;
    this.count = 0;
    this.numStrikes = 5;  // Max of 5, bounded by this.initLine
    this.strike = 0;
    this.initLine = [0, 255, PI, -PI/2, -PI/5];
    this.randomRotate = PI/2;
    this.len;
  }

  draw(){
    push();
    for (this.strike = 0; this.strike < this.numStrikes; this.strike++) {
      // For each strike, return to the center
      pop();
      push();
      // Draw maxVal lines as part of a strike.
      while (this.count < this.maxVal) {
        if (this.count === 0){
          rotate(this.initLine[this.strike]);
          this.len = random(3, 15);
          line(0, 0, 0, -this.len);
          stroke([255, 255, 255, 255]);
          strokeWeight(2);
          translate(0, -this.len);
          this.count = this.count + 1;
        }
        else{
          this.count = this.count + 1;
          this.len = random(3, 15);
          rotate(random(-this.randomRotate, this.randomRotate));
          line(0, 0, 0, -this.len);
          stroke([255, 255, 255, (255 * ((this.maxVal-this.count)/this.maxVal))]);
          strokeWeight(4);
          translate(0, -this.len);
        }
      }
      this.count = 0;
    }
  pop();
  }
}


class ExpandingCircle {
  constructor(maxRadius, speed){
    this.maxRadius = maxRadius;
    this.speed = speed;

    this.radiusGrowth = 1;
  }

  draw() {
    stroke(COLOR_ANIM_LIGHTNING);
    strokeWeight(2);
    fill([0, 0, 0, 0]);
    circle(0, 0, (5 + this.radiusGrowth));
    this.radiusGrowth += this.speed;
    if (this.radiusGrowth >= this.maxRadius)
      this.radiusGrowth = 1;
    }
  }

//expanding concentric circles, solid/black strobe
//first 3 parameters control position and size
//increase speed by increasing frame rate (fr) or decreasing nCircles
class CircleStrobe{
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.minD=2; //diameter of smallest circle;
    this.d = 2;
    this.dIncr;
    this.nCircles = 35;
  }

  draw(colorRange){
    push();
    stroke(colorRange);
    strokeWeight(2);
    blendMode(DIFFERENCE);
    this.dIncr=ceil((this.size-this.minD)/this.nCircles); //num pixels to increment diameter
    this.d+=this.dIncr;
    if (this.d<=this.size) {
        fill(colorRange)
        circle(0, 0,this.d);
    }
    else if (this.d > this.size) {
        this.d = this.minD;
    }
    pop();
  }
}

//expanding concentric circles with color fade
//first 3 arguments specify location & circle size
//increase speed by increasing frame rate (fr) or decreasing nCircles
//fadeTo="light" if fading from light to dark, "dark" to reverse it
//eraseCircles=true to erase radially with black or white after drawing circles
class CircleFade {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.minD=2; //diameter of smallest circle;
    this.d = 2;
    this.dIncr;
    this.nCircles = 32;
    this.p = 1;
    this.lightest;
    this.darkest;
  }

  draw(fadeTo,eraseCircles,colorRange) {
    push();
    //set lightest and darkest color
    this.lightest = color(colorRange[0]);
    this.darkest = color(colorRange[2]);

    strokeWeight(2);
    if (fadeTo=="light"){
      blendMode(DARKEST);
    }
    else{
      blendMode(LIGHTEST);
    }
    //num pixels to increment diameter
    this.dIncr=ceil((this.size - (frameCount%30))/this.nCircles);
    this.d+=this.dIncr;
    //set color between lightest and darkest
    //this.p=(this.nCircles-this.d)/this.nCircles;
    if (this.d<=this.size){
      if (fadeTo=="light"){
        fill(color(lerpColor(this.lightest,this.darkest,this.p)));
        stroke(color(lerpColor(this.lightest,this.darkest,this.p)));
      }
      else {
        fill(color(lerpColor(this.lightest,this.darkest,1-this.p)));
        stroke(color(lerpColor(this.lightest,this.darkest,1-this.p)));
      }
      circle(0, 0,this.d); //draw circle
    }
    else if(eraseCircles == false && this.d > this.size){
      this.d = this.minD;
    }

    if (eraseCircles==true && this.d>this.size && this.d/2<=this.size){
        if (fadeTo=="light"){
          fill(color(0,0,0));
          console.log(this.d);
        }
        else{
          fill(color(255,255,255));
        }
        circle(0,0,this.d-this.size);
    }

    if (this.d >= this.size * 2){
      this.d = 2;
    }
    pop();
  }
}

//star that rotates and expands to fill the circle
//xCenter,yCenter,maxD specify size of outer circle
//increase speed by increasing frame rate (fr) or decreasing magnitude of rotation
//nPoints = number of points on the star

function starRotate(xCenter,yCenter,maxD,speed,nPoints,rotation,colorRange){
   noStroke();
   frameRate(fr);
   push();
   translate(xCenter, yCenter);
   rotate(frameCount / rotation);
   //set lightest and darkest color
   lightest = color(colorRange[0]);
   darkest = color(colorRange[2]);
   p=1-frameCount/fr;
  fill(color(lerpColor(lightest,darkest,p)));
   star(x=0,y=0,radius1=maxD/4,radius2=maxD/2,nPoints);
   pop();
}

//spiral radiating from center outwards
//xCenter,yCenter,maxD specify size of outer circle
//increase speed by increasing frame rate (fr) or spread
//changing spread also changes the spiral shape
function spiral(xCenter,yCenter,maxD,fr,spread,colorSpiral){
    frameRate(fr);
   //initialize parameters controlling shape and spread of spiral
    if (frameCount==1){
      angle=10.0;
      scalar=20;
    }
    var x = xCenter + cos(angle) * scalar;
    var y = xCenter + sin(angle) * scalar;
    if (x<=xCenter+maxD/2 && y<=yCenter+maxD/2){
      fill(colorSpiral);
      circle(x, y, 5);
      angle += spread;
      scalar += spread;
    }
}

//vertical lines fill from right edge of circle to left
//xCenter,yCenter,maxD specify size of outer circle
//increase speed by increasing frame rate (fr) or decreasing number of lines (nLines);
//direction=LR (left to right) or RL
function vertLines(xCenter,yCenter,maxD,fr,nLines,colorRange){
    frameRate(fr);
    noFill();
    //circle(xCenter,yCenter,maxD);
    //initialize X coordinate of line
    if (frameCount==1 && direction=="RL"){
      offsetX=maxD/2;
    }
    if (frameCount==1 && direction=="LR"){
      offsetX=-maxD/2;
    }
   //set lightest and darkest color
   lightest = color(colorRange[0]);
   darkest = color(colorRange[2]);

    //distance between lines
    spacing=maxD/(nLines-1);
    r=maxD/2;
    //determine length of chord, start and end coordinates
    if (frameCount<=nLines){
      translate(offsetX,0);
      chordLength=sqrt(r**2-(r-spacing*(frameCount-1))**2);
      p=frameCount/nLines;
             stroke(color(lerpColor(lightest,darkest,p)));
      if (direction=="RL"){
      line(xCenter,yCenter-chordLength,xCenter,yCenter+chordLength);
      offsetX-=spacing;
      }
      else if (direction=="LR"){
          line(xCenter,yCenter-chordLength,xCenter,yCenter+chordLength);
      offsetX+=spacing;
      }
    }
  }


//star function from p5 website examples
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

//function calls for animations with different parameters
//uncomment once we can test with different sounds to trigger each one
//circleStrobe(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=20,colorStrobe=COLOR_BLUES[1]);
//circleStrobe(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=10,colorStrobe=COLOR_GREENS[2]);
//circleStrobe(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=5,colorStrobe=COLOR_PURPLES[0]);
//circleFade(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=20,fadeTo="light",eraseCircles=true,colorRange=COLOR_BLUES);
//circleFade(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=20,fadeTo="light",eraseCircles=false,colorRange=COLOR_GREENS);
//circleFade(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=20,fadeTo="dark",eraseCircles=true,colorRange=COLOR_BLUES);
//circleFade(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nCircles=20,fadeTo="dark",eraseCircles=false,colorRange=COLOR_BLUES);
//starRotate(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nPoints=5, rotation=-20,colorRange=COLOR_GREENS)
//starRotate(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nPoints=6, rotation=50,colorRange=COLOR_PURPLES);
//spiral(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,spread=1.5,colorSpiral=COLOR_BLUES[1]);
//spiral(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,spread=3,colorSpiral=COLOR_GREENS[1]);
//spiral(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,spread=7,colorSpiral=COLOR_PURPLES[1]);
//vertLines(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nLines=15,colorRange=COLOR_PURPLES,direction="RL");
//vertLines(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nLines=25,colorRange=COLOR_GREENS,direction="LR");
//vertLines(xCenter=0,yCenter=0,maxD=2*this.size-50,fr=30,nLines=7,colorRange=COLOR_BLUES,direction="LR");
