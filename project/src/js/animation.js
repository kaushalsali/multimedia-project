function animationDraw(currentPlaying) {
  console.log(currentPlaying);
  if (currentPlaying === 'C4'){
    push();
    lightning();
    pop();
  }
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
