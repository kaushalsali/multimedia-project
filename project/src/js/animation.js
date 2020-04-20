
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
      this.starRotate = new StarRotate(this.x, this.y, this.size);
      this.spiral = new Spiral(this.x, this.y, this.size);
      this.vertLines = new VertLines(this.x, this.y, this.size);
      this.staticStar = new Star(this.x, this.y, this.size);
    }

    switch(animNum){
      switch (animNum) {
        case 'anim1':
          this.lightning.draw();
          break;
        case 'anim2':
          this.expandingCircle.draw();
          break;
        case 'anim3':
          this.circleFade.draw("light", true, COLOR_ORANGE);
          break;
        case 'anim4':
          this.starRotate.draw(5, -20, COLOR_GREENS);
          break;
        case 'anim5':
          this.circleStrobe.draw(COLOR_BLUES[1]);
          break;
        case 'anim6':
          this.spiral.draw(2, COLOR_BLUES[1]);
          break;
        case 'anim7':
          this.vertLines.draw(32,COLOR_PURPLES,"RL");
          break;
        case 'anim8':
          this.staticStar.draw(this.size, this.size/2, 5, COLOR_ORANGE[2]);
          break;
      }
    }

    draw(currentPlaying) {
      this.switch(ANIM_MAPPING[currentPlaying]);
      //console.log(ANIM_MAPPING[currentPlaying]);
      //console.log(this.anim_mapping['anim1']);

      // If statement is temporary while testing functions and
      // different color sets. Eventually, implement the commented
      // out line above.
      // if (currentPlaying === 'C4'){
      //   this.starRotate.draw(5, -20, COLOR_GREENS);
      // }
      // else if (currentPlaying === 'D4'){
      //   this.expandingCircle.draw();
      // }

    }
}


// ---------------------------------------------------------------
// ---------------------------------------------------------------
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
    this.nCircles = 32;
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

class StarRotate {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.minD=2; //diameter of smallest circle;
    this.d = 2;
    this.nPoints;
    this.p = 1;
    this.lightest;
    this.darkest;
    this.rotation;
    this.currentRotation = 0;

    this.star = new Star(this.x, this.y, this.size/2);
  }

  draw(nPoints,rotation,colorRange) {
    this.nPoints = nPoints;
    this.rotation = rotation;
    noStroke();
    push();
    //translate(this.x, this.y);
    rotate(this.currentRotation / this.rotation);
    //set lightest and darkest color
    this.lightest = color(colorRange[0]);
    this.darkest = color(colorRange[2]);
    this.p=1-this.currentRotation/30;
    fill(color(lerpColor(this.lightest,this.darkest,this.p)));
    this.star.draw(this.size, this.size/2,this.nPoints, color(lerpColor(this.lightest,this.darkest,this.p)));
    this.currentRotation += 1;
    if (this.currentRotation >= 30) {
      this.currentRotation = 0;
    }
    pop();
  }

}

//spiral radiating from center outwards
//xCenter,yCenter,maxD specify size of outer circle
//increase speed by increasing frame rate (fr) or spread
//changing spread also changes the spiral shape
class Spiral {
  constructor (x, y, size) {
    this.x = x;  // Previously xCenter
    this.y = y;  // Previously yCenter
    this.size = size;
    this.angle = 8.0;
    this.scalar = 18;
    this.xVal;  // Previously x
    this.yVal;  // Previously y
  }

  draw(spread,colorSpiral){
    push();
    this.xVal = cos(this.angle) * this.scalar;
    this.yVal = sin(this.angle) * this.scalar;
    if (this.xVal<=this.size-20 && this.yVal<=this.size-20){
      fill(colorSpiral);
      circle(this.xVal, this.yVal, 8);
      this.angle += spread;
      this.scalar += spread;
    }
    else{
      this.angle = 8.0;
      this.scalar = 18;
    }
    pop();
  }
}

//vertical lines fill from right edge of circle to left
//xCenter,yCenter,maxD specify size of outer circle
//increase speed by increasing frame rate (fr) or decreasing number of lines (nLines);
//direction=LR (left to right) or RL
class VertLines{
  constructor (x, y, size) {
    this.x = x;  // Previously xCenter
    this.y = y;  // Previously yCenter
    this.size = size;
    this.lightest;
    this.darkest;
    this.offsetX = this.size / 2;
    this.spacing;
    this.currentIteration = 0;
    this.chordLength;
    this.p;
  }

  draw(nLines,colorRange, direction){
    push();
    noFill();

    //circle(xCenter,yCenter,maxD);
    //initialize X coordinate of line
    if (this.currentIteration == 0 && direction == "RL"){
      this.offsetX = this.size + 10;
    }
    if (this.currentIteration == 0 && direction == "LR"){
      this.offsetX = -Math.abs(this.size + 10);
    }
    //set lightest and darkest color
    this.lightest = color(colorRange[0]);
    this.darkest = color(colorRange[2]);

    //distance between lines
    this.spacing = (this.size * 2) / (nLines-1);

    //determine length of chord, start and end coordinates
    if (this.currentIteration<=nLines){
      console.log('in if statement');
      push();
      translate(this.offsetX,0);
      this.chordLength=sqrt(this.size**2-(this.size-this.spacing*(this.currentIteration-1))**2);
      this.p=this.currentIteration/nLines;
      strokeWeight(8);
      stroke(color(lerpColor(this.lightest,this.darkest,this.p)));
      if (direction=="RL"){
        line(0,0-this.chordLength,0,0+this.chordLength);
        this.offsetX-=this.spacing;
      }
      else if (direction=="LR"){
          line(0,0-this.chordLength,0,0+this.chordLength);
          this.offsetX+=this.spacing;
      }
      this.currentIteration += 1;
      pop();
    }
    else {
      this.currentIteration = 0;
    }
    pop();
  }
  }


//star function from p5 website examples
class Star{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sx;
    this.sy;
    this.angle;
    this.halfAngle;
    this.currentIteration = 0;
    this.rotation;
  }
  draw(radius1, radius2, nPoints, c) {
    this.angle = TWO_PI / nPoints;
    this.halfAngle = this.angle / 2.0;
    beginShape();
    fill(c);
    if(this.currentIteration == 0) {
      this.rotation = random(-10, 10);
    }
    rotate(this.rotation);
    for (var a = 0; a < TWO_PI; a += this.angle) {
      this.sx = 0 + cos(a) * radius2;
      this.sy = 0 + sin(a) * radius2;
      vertex(this.sx, this.sy);
      this.sx = 0 + cos(a + this.halfAngle) * radius1;
      this.sy = 0 + sin(a + this.halfAngle) * radius1;
      vertex(this.sx, this.sy);
    }
    endShape(CLOSE);
    this.currentIteration += 1;
    console.log(this.currentIteration);
    if (this.currentIteration >= 30) {
      this.currentIteration = 0;
    }
}
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
