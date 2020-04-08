let keyWidth = 70;
let keyHeight = 90;
let keyTextSize = 17;
let keyTextStrokeWeight = 0;
let keyboardStrokeWeight = 1.5;

let rSide = [];
let black = [];
let mid = [];
let lSide = [];

let rKee = ['A', null, null, 'F', null, null, null, 'K', null, null];
let blKee = ['W', 'E', null, 'T', 'Y', 'U', null, 'O', 'P', null, null];
let midKee = [null, 'S', null, null, 'G', 'H', null, null, 'L', null];
let lKee = [null, null, 'D', null, null, null, "J", null, null, ';'];

function setupKeyboard() {
    let offset = (width - 10 * keyWidth)/ 2;
    for (let i = 0; i < 10; i++) {
        rSide.push(new RSideKey(i*keyWidth + offset, keyWidth, keyHeight, rKee[i]));
        black.push(new BlackKey((i+0.667)*keyWidth + offset, keyWidth, keyHeight, blKee[i]));
        mid.push(new MidKey(i*keyWidth + offset, keyWidth, keyHeight, midKee[i]));
        lSide.push(new LSideKey(i*keyWidth + offset, keyWidth, keyHeight, lKee[i]));
    }
}

function drawKeyboard() {
    stroke(0);
    for (let i = 0; i < rSide.length; i++) {
        if (i === 0 || i === 3 || i === 7) {
            rSide[i].display();
        }
        if ((i !== 2) && (i !== 6) && (i !== 9) && (i !== 10)) {
            black[i].display();
        }
        if (i === 1 || i === 4 || i === 5 || i === 8) {
            mid[i].display();
        }
        if (i === 2 || i === 6 || i === 9) {
            lSide[i].display();
        }
    }
}

function RSideKey(x, keyWidth, keyHeight, kee) {
    this.x = x;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;
    this.kee = kee;

    this.display = function() {
        fill(COLOR_KEYBOARD_WHITE_KEYS);
        strokeWeight(keyboardStrokeWeight);

        beginShape();
        vertex(this.x, 0);
        vertex(this.x, this.keyHeight);
        vertex(this.x + this.keyWidth, this.keyHeight);
        vertex(this.x + this.keyWidth, this.keyHeight * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), this.keyHeight * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), 0);
        endShape();

        fill(COLOR_BLACK);
        strokeWeight(keyTextStrokeWeight);
        textSize(keyTextSize);
        text(this.kee, this.x + this.keyWidth * 0.4, this.keyHeight * 0.85);
    };
}

function MidKey(x, keyWidth, keyHeight, kee ) {
    this.x = x;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;

    this.kee = kee;

    this.display = function() {
        fill(COLOR_KEYBOARD_WHITE_KEYS);
        strokeWeight(keyboardStrokeWeight);
        beginShape();
        vertex(this.x + (this.keyWidth * 0.333), 0);
        vertex(this.x + (this.keyWidth * 0.333), this.keyHeight * 0.6);
        vertex(this.x, this.keyHeight * 0.6);
        vertex(this.x, this.keyHeight);
        vertex(this.x + this.keyWidth, this.keyHeight);
        vertex(this.x + this.keyWidth, this.keyHeight * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), this.keyHeight * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), 0);
        endShape();

        fill(COLOR_BLACK);
        strokeWeight(keyTextStrokeWeight);
        textSize(keyTextSize);
        text(this.kee, this.x + this.keyWidth * 0.4, this.keyHeight * 0.85);
    }
}

function LSideKey(x, keyWidth, keyHeight, kee) {
    this.x = x;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;
    this.kee = kee;

    this.display = function() {
        fill(COLOR_KEYBOARD_WHITE_KEYS);
        strokeWeight(keyboardStrokeWeight);
        beginShape();
        vertex(this.x + (this.keyWidth * 0.333), 0);
        vertex(this.x + (this.keyWidth * 0.333), this.keyHeight * 0.6);
        vertex(this.x, this.keyHeight * 0.6);
        vertex(this.x, this.keyHeight);
        vertex(this.x + this.keyWidth, this.keyHeight);
        vertex(this.x + this.keyWidth, 0);
        endShape();

        fill(COLOR_BLACK);
        strokeWeight(keyTextStrokeWeight);
        textSize(keyTextSize);
        text(this.kee, this.x + this.keyWidth * 0.4, this.keyHeight * 0.85);
    };
}

function BlackKey(x, keyWidth, keyHeight, kee) {
    this.x = x;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;
    this.kee = kee;

    this.display = function() {
        fill(COLOR_KEYBOARD_BLACK_KEYS);
        strokeWeight(keyboardStrokeWeight);
        rect(this.x, 0, (this.keyWidth * 0.667), this.keyHeight * 0.6);

        fill(COLOR_DEFAULT_SAMPLE);
        strokeWeight(keyTextStrokeWeight);
        textSize(keyTextSize);
        text(this.kee, this.x + this.keyWidth * 0.2, this.keyHeight * 0.5);
    }
}


function handleKeyPress() {}