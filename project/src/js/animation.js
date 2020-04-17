function animationDraw(currentPlaying) {
  console.log(currentPlaying);
  if (currentPlaying === 'C4'){
    push();
    lightning();
    pop();
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
}

function lightning() {
  let maxVal = 15;
  let count = 0;
  let len = 10;
  let numStrikes = 5;  // Max of 5, bounded by initLine
  let strike = 0;
  let initLine = [0, 255, PI, -PI/2, -PI/5];
  let randomRotate = PI/2;
  for (strike = 0; strike < numStrikes; strike++) {
    // For each strike, return to the center
    pop();
    push();
    // Draw maxVal lines as part of a strike.
    while (count < maxVal) {
      if (count === 0){
        rotate(initLine[strike]);
        len = random(3, 15);
        line(0, 0, 0, -len);
        stroke([255, 255, 255, 255]);
        strokeWeight(2);
        translate(0, -len);
        count = count + 1;
      }
      else{
        randomRotate = PI/4;
        count = count + 1;
        len = random(3, 15);
        rotate(random(-randomRotate, randomRotate));
        line(0, 0, 0, -len);
        stroke([255, 255, 255, (255 * ((maxVal-count)/maxVal))]);
        strokeWeight(4);
        translate(0, -len);
      }
    }
    animCount = 0;
  }
}

let radiusGrowth = 1;
function test(maxRadius, speed) {
  stroke(COLOR_ANIM_LIGHTNING);
  strokeWeight(2);
  circle(0, 0, (5 + radiusGrowth));
  radiusGrowth += speed;
  if (radiusGrowth >= maxRadius) {
    radiusGrowth = 1;
  }
}

//expanding concentric circles, solid/black strobe
//first 3 parameters control position and size
//increase speed by increasing frame rate (fr) or decreasing nCircles
function circleStrobe(xCenter,yCenter,maxD,fr,nCircles,colorRange){
  noStroke();
  frameRate(fr);
  minD=10; //diameter of smallest circle;
  blendMode(DIFFERENCE);
  dIncr=ceil((maxD-minD)/nCircles); //num pixels to increment diameter
  if (frameCount==1){
    d=minD;
  }
  else {
    d+=dIncr;
  }
  if (d<=maxD) {
      fill(colorStrobe);
      circle(xCenter,yCenter,d);
  }
}

//expanding concentric circles with color fade
//first 3 arguments specify location & circle size
//increase speed by increasing frame rate (fr) or decreasing nCircles
//fadeTo="light" if fading from light to dark, "dark" to reverse it
//eraseCircles=true to erase radially with black or white after drawing circles
function circleFade(xCenter,yCenter,maxD,fr,nCircles,fadeTo,eraseCircles,colorRange){
   noStroke();
   frameRate(fr);
   //set lightest and darkest color
   lightest = color(colorRange[0]);
   darkest = color(colorRange[2]);
   minD=10; //diameter of smallest circle;
   if (fadeTo=="light"){
     blendMode(DARKEST);
   }
   else {
     blendMode(LIGHTEST);
   }
  //num pixels to increment diameter
   dIncr=ceil((maxD-minD)/nCircles);
   if (frameCount==1){
    d=minD;
   }
   else {
    d+=dIncr;
   }
   //set color between lightest and darkest
    p=(nCircles-frameCount)/nCircles;
    if (d<=maxD){
      if (fadeTo=="light"){
        fill(color(lerpColor(lightest,darkest,p)));
      }
      else {
        fill(color(lerpColor(lightest,darkest,1-p)));
      }
      circle(xCenter,yCenter,d); //draw circle
    }
    if (eraseCircles==true && d>maxD && d/2<=maxD){
        if (fadeTo=="light"){
          fill(color(0,0,0));
        }
        else{
          fill(color(255,255,255));
        }
        circle(xCenter,yCenter,d-maxD);
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
