
class AnimationManager {
    constructor(x, y, size){
      this.x = x;
      this.y = y;
      this.size = size - 20;

      // Create an instance of each object for each node
      this.animationHandler = {
        'lightning': new Lightning(),
        'expandingCircle': new ExpandingCircle(this.size, 3.4),
        'circleStrobe': new CircleStrobe(this.x,this.y,this.size),
        'circleFade': new CircleFade(this.x,this.y,this.size),
        'starRotate': new StarRotate(this.x, this.y, this.size),
        'spiral': new Spiral(this.x, this.y, this.size),
        'vertLines': new VertLines(this.x, this.y, this.size),
        'staticStar': new Star(this.x, this.y, this.size),
        'radiateLines': new RadiateLines(this.x, this.y, this.size),
        'fillAcross': new FillAcross(this.x, this.y, this.size)
      }

      this.prevAnim;
      this.trigger = false;
    }

    draw(currentPlaying){
      let currentAnim = ANIM_MAPPINGS[currentPlaying];
      if (currentAnim != this.prevAnim) {
        this.trigger = true;
        this.prevAnim = currentAnim;
      }
      else
        this.trigger = false;

      switch (currentAnim) {
        case ANIM.LIGHTNING:
          this.animationHandler['lightning'].draw();
          break;
        case ANIM.EMPTY_CIRCLE:
          this.animationHandler['expandingCircle'].draw(this.trigger);
          break;
        case ANIM.FADE_ORANGE:
          this.animationHandler['circleFade'].draw("light", true, COLOR_ORANGE, this.trigger);
          break;
        case ANIM.ROT_STAR_GREEN:
          this.animationHandler['starRotate'].draw(5, -20, COLOR_GREENS, this.trigger);
          break;
        case ANIM.STROBE_BLUE:
          this.animationHandler['circleStrobe'].draw(COLOR_BLUES[1], this.trigger);
          break;
        case ANIM.SPIRAL_BLUE:
          this.animationHandler['spiral'].draw(2, COLOR_BLUES[1], this.trigger);
          break;
        case ANIM.VERT_PURPLE:
          this.animationHandler['vertLines'].draw(32,COLOR_PURPLES,"RL", this.trigger);
          break;
        case ANIM.STATIC_STAR_ORANGE:
          this.animationHandler['staticStar'].draw(this.size, this.size/2, 5, COLOR_ORANGE[2], this.trigger);
          break;
        case ANIM.RAD_PURPLE:
          this.animationHandler['radiateLines'].draw(COLOR_PURPLES,'L', 30, this.trigger);
          break;
        case ANIM.ACROSS_PURPLE:
          this.animationHandler['fillAcross'].draw(COLOR_PURPLES,'B', this.trigger);
          break;
      }
    }

}


// ---------------------------------------------------------------
// ---------------------------------------------------------------
function staticLightning(strike, numStrikes, count, maxVal, rotateArray, lenArray) {
  for (strike = 0; strike < numStrikes; strike++){
    // For each strike, return to the center
    pop();
    push();
    // Draw maxVal lines as part of a strike.
    while (count < maxVal) {
      if (count === 0){
        rotate(rotateArray[strike]);
        len = lenArray[strike];
        line(0, 0, 0, -len);
        stroke([255, 255, 255, 255]);
        strokeWeight(2);
        translate(0, -len);
        count = count + 1;
      }
      else{
        //console.log(this.strike);
        //console.log(this.count);
        len = lenArray[(strike * maxVal) + count];
        rotate(rotateArray[(strike * maxVal) + count]);
        line(0, 0, 0, -len);
        stroke([255, 255, 255, (255 * ((maxVal-count)/maxVal))]);
        strokeWeight(4);
        translate(0, -len);
        count = count + 1;
      }
    }
    count = 0;
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
    this.currentRandomRotate;
    this.len;
    this.iteration = 0;
    this.lenArray = [];
    this.rotateArray = [];
  }

  draw(){
    push();
    if (this.iteration == 0) {
      for (this.strike = 0; this.strike < this.numStrikes; this.strike++) {
        // For each strike, return to the center
        pop();
        push();
        // Draw maxVal lines as part of a strike.
        if (this.strike == 0 && this.count == 0){
          this.rotateArray = [];
          this.lenArray = [];
        }
        while (this.count < this.maxVal) {
          if (this.count === 0){
            rotate(this.initLine[this.strike]);
            this.rotateArray.push(this.initLine[this.strike]);
            this.len = random(3, 15);
            this.lenArray.push(this.len);
            line(0, 0, 0, -this.len);
            stroke([255, 255, 255, 255]);
            strokeWeight(2);
            translate(0, -this.len);
            this.count = this.count + 1;
          }
          else{
            this.count = this.count + 1;
            this.len = random(3, 15);
            this.lenArray.push(this.len);
            this.currentRandomRotate = random(-this.randomRotate, this.randomRotate);
            this.rotateArray.push(this.currentRandomRotate);
            rotate(this.currentRandomRotate);
            line(0, 0, 0, -this.len);
            stroke([255, 255, 255, (255 * ((this.maxVal-this.count)/this.maxVal))]);
            strokeWeight(4);
            translate(0, -this.len);
          }
        }
        this.count = 0;
      }
      this.iteration += 1;
      //console.log(this.rotateArray);
    }
    else if (this.iteration >= 10) {
      this.iteration = 0;
      staticLightning(this.strike, this.numStrikes, this.count, this.maxVal, this.rotateArray, this.lenArray);
    }
    else {
      this.iteration += 1;
      staticLightning(this.strike, this.numStrikes, this.count, this.maxVal, this.rotateArray, this.lenArray);
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

  draw(trigger) {
    if(trigger){
      this.radiusGrowth = 1;
    }
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

  draw(colorRange, trigger){
    if (trigger) {
      this.d = this.minD;
    }
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

  draw(fadeTo,eraseCircles,colorRange, trigger) {
    if (trigger) {
      this.d = 2;
    }
    push();
    //set lightest and darkest color
    this.lightest = color(colorRange[0]);
    this.darkest = color(colorRange[2]);

    strokeWeight(2);
    blendMode(LIGHTEST);
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

  draw(nPoints,rotation,colorRange, trigger) {
    if (trigger) {
      this.currentRotation = 0;
    }
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
    this.star.draw(this.size, this.size/2,this.nPoints, color(lerpColor(this.lightest,this.darkest,this.p)), trigger);
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

  draw(spread,colorSpiral, trigger){
    if (trigger) {
      this.angle = 8.0;
      this.scalar = 18;
    }
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

  draw(nLines,colorRange, direction, trigger){
    if (trigger) {
      this.currentIteration = 0;
    }
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
  draw(radius1, radius2, nPoints, c, trigger) {
    if (trigger) {
      this.currentIteration = 0;
    }
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
    if (this.currentIteration >= 30) {
      this.currentIteration = 0;
    }
}
}

class RadiateLines {
  constructor(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.currentIteration = 0;

    this.lightest;
    this.darkest;
    this.lineCenter = 1;
    this.stop;
    this.p;
  }

  draw(colorRange,startSweep,nLines, trigger){
    if (trigger) {
      this.currentIteration = 1;
    }
    console.log(this.currentIteration);
    this.p=this.currentIteration/nLines;
    blendMode(LIGHTEST);
    //set lightest and darkest color
    this.lightest = color(colorRange[0]);
    this.darkest = color(colorRange[2]);
    stroke(color(lerpColor(this.lightest,this.darkest,this.p)));
    strokeWeight(4);
    noFill();
    if (startSweep=='R'){
      this.lineCenter=0;
    }
    else if (startSweep=='L'){
      this.lineCenter=PI;
    }
    // start=lineCenter;
    //set arc coordinates
     if (this.currentIteration==1){
       this.stop=this.lineCenter;
     }
     else if (stop<=this.lineCenter+TWO_PI){
       this.stop+=2*PI/nLines;
     }
     else {
       this.stop=this.lineCenter+TWO_PI;
     }
    arc(0, 0, this.size, this.size, this.lineCenter, this.stop,CHORD);
    if (this.currentIteration > nLines){
      this.currentIteration = 0;
    }
    this.currentIteration++;
  }
}

class FillAcross {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;

    this.incr = PI/32;
    this.start;
    this.stop;
  }
  draw(colorRange,startPosition, trigger){
    if(trigger){
      if (startPosition=="R"){
        this.start=-this.incr;
        this.stop=this.incr;
      }
      else if (startPosition=="L"){
        this.start=PI-this.incr;
        this.stop=PI+this.incr;
      }
      else if (startPosition=="B"){
        this.start=PI/2-this.incr;
        this.stop=PI/2+this.incr;
      }
      else if (startPosition=="T"){
        this.start=3*PI/2-this.incr;
        this.stop=3*PI/2+this.incr;
      }
    }
    fill(colorRange[1]);
    this.start-=this.incr;
    this.stop+=this.incr;
    arc(0, 0, this.size, this.size, this.start, this.stop, OPEN);
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
