let backgroundColor;
let backgroundColorIndex = 0;

let numNodes = 1;
let nodes = [];
let selectedNode = 0;

// State
let isPlaying = false;
let isRecording = false;

// Tone
let masterEnv;
let comp;
let reverb;
let delay;
let vibrato;
let filter;

// UI
let btnPlay;
let btnRecord;
let tempoSlider;
let vibratoSlider;
let reverbSlider;
let filterSlider;
let noteDurationSlider;


function setup() {
    let myCanvas = createCanvas(100,100);
    resizeCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent('canvas-container');
    background(COLOR_BACKGROUND);
    backgroundColor = COLOR_CHANGING_BACKGROUND[backgroundColorIndex];


    // Setup Keyboard
    setupKeyboard();

    // Setup UI
    setupUI();

    // Tone Setup
    setupTone();

    // Create Nodes
    for (let i=0; i<numNodes; i++) {
        nodes[i] = new Node(width / 2, height / 2, NODE_SIZE);
        nodes[i].connectSynth(filter);
    }

}


function draw() {

    if (isPlaying)
        nodes[selectedNode].setNodeFaceColor(backgroundColor);
    else
        nodes[selectedNode].setNodeFaceColor(COLOR_NODE_FACE);


    background(COLOR_BACKGROUND);

    if (isRecording)
        drawKeyboard();

    for (let i=0; i<numNodes; i++)
        nodes[i].draw();

}


function updateBackgroundColor() {
    backgroundColorIndex = (backgroundColorIndex + 1) % COLOR_CHANGING_BACKGROUND.length;
    backgroundColor = COLOR_CHANGING_BACKGROUND[backgroundColorIndex];
}


function setupTone() {

    masterEnv = new Tone.AmplitudeEnvelope();
    masterEnv.toMaster();
    masterEnv.triggerAttack();

    comp = new Tone.Compressor();
    comp.connect(masterEnv);

    reverb = new Tone.Freeverb();
    reverb.connect(comp);

    vibrato = new Tone.Vibrato(5.0, 0.1);
    vibrato.connect(reverb);

    filter = new Tone.Filter({
        type  : "lowpass",
        frequency  : 700 ,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    });

    filter.connect(vibrato);

    Tone.Transport.scheduleRepeat((time)=>{
        for (let i=0; i<numNodes; i++) {
            nodes[i].step();
            updateBackgroundColor();
        }
    }, "8n");
    Tone.Transport.bpm.value = 60;
}


function setupUI() {

    let btnWidth = 180;
    let btnHeight = 35;

    btnPlay = createButton("Play");
    btnPlay.size(btnWidth, btnHeight);
    btnPlay.position(width/2 + 20, height - 150);
    btnPlay.addClass("myButton");
    btnPlay.mousePressed(togglePlay);
    btnPlay.html("Play");

    btnRecord = createButton("Add Notes");
    btnRecord.size(btnWidth, btnHeight);
    btnRecord.position(width/2 - btnWidth - 20, height - 150);
    btnRecord.addClass("myButton");
    btnRecord.mousePressed(toggleRecord);
    btnRecord.html("Add Notes");

    let sliderSize = 250;
    // Left Side Sliders
    tempoSlider = createSlider(30, 300, 120);
    tempoSlider.size(sliderSize);
    tempoSlider.position((width/2 - NODE_SIZE)/2 - sliderSize/2, height/2);
    tempoSlider.addClass("mySlider");
    tempoSlider.input(changeTempo);

    // Right Side Sliders
    vibratoSlider = createSlider(0, 35, 10);
    vibratoSlider.size(sliderSize);
    vibratoSlider.position((width/2 + NODE_SIZE) + (width/2 - NODE_SIZE)/2 - sliderSize/2, height/2 - 75);
    vibratoSlider.addClass("mySlider");
    vibratoSlider.input(changeVibratoDepth);

    filterSlider = createSlider(100, 5000, 1000);
    filterSlider.size(sliderSize);
    filterSlider.position((width/2 + NODE_SIZE) + (width/2 - NODE_SIZE)/2 - sliderSize/2, height/2 - 25);
    filterSlider.addClass("mySlider");
    filterSlider.input(changeFilterCutoff);

    reverbSlider = createSlider(0, 100, 70);
    reverbSlider.size(sliderSize);
    reverbSlider.position((width/2 + NODE_SIZE) + (width/2 - NODE_SIZE)/2 - sliderSize/2, height/2 + 25);
    reverbSlider.addClass("mySlider");
    reverbSlider.input(changeReverbRoomSize);

    noteDurationSlider = createSlider(1, 10000, 300);
    noteDurationSlider.size(sliderSize);
    noteDurationSlider.position((width/2 + NODE_SIZE) + (width/2 - NODE_SIZE)/2 - sliderSize/2, height/2 + 75);
    noteDurationSlider.addClass("mySlider");
    noteDurationSlider.input(changeNoteDuration);

}

function drawText() {
    let sliderSize = 250;
    textSize(50);
    fill(COLOR_KEYBOARD_WHITE_KEYS);
    text("Tempo", (width/2 - NODE_SIZE)/2 - sliderSize/2, height/2 + 50);
}

function changeTempo() {
    Tone.Transport.bpm.value = tempoSlider.value();
}

function changeVibratoDepth() {
    vibrato.depth.value = vibratoSlider.value()/100;
}

function changeFilterCutoff() {
    filter.frequency.value = filterSlider.value();
}

function changeReverbRoomSize() {
    reverb.roomSize.value = reverbSlider.value()/100;
}

function changeNoteDuration() {
    let val = noteDurationSlider.value()/10000;
    nodes[selectedNode].setInterval(val);
    nodes[selectedNode].setReleaseTime(val);
//    nodes[selectedNode].setAttackTime(val);
}

function toggleRecord() {
    if (isRecording) {
        btnRecord.html("Add Notes");
    }
    else {
        btnRecord.html("Stop Adding");
        nodes[selectedNode].clearSamples();
    }
    isRecording = !isRecording;
}

function togglePlay() {
    if (isPlaying) {
        Tone.Transport.pause();
        btnPlay.html("Play");
    }
    else {
        Tone.Transport.start();
        btnPlay.html("Pause");
    }
    isPlaying = !isPlaying;
}


document.addEventListener('keydown', function(event) {

    if (event.keyCode === 80) {     // P - START TONE.JS
        Tone.start();
        console.log('Tone started');
        Tone.Master.volume = -10;
    }

    if (isRecording) {
        if (event.keyCode === 65) { // A
            nodes[selectedNode].addSample("C4");
        }
        else if (event.keyCode === 83) { // S
            nodes[selectedNode].addSample("D4");
        }
        else if (event.keyCode === 68) { // D
            nodes[selectedNode].addSample("E4");
        }
        else if (event.keyCode === 70) { // F
            nodes[selectedNode].addSample("F4");
        }
        else if (event.keyCode === 71) { // G
            nodes[selectedNode].addSample("G4");
        }
        else if (event.keyCode === 72) { // H
            nodes[selectedNode].addSample("A4");
        }
        else if (event.keyCode === 74) { // J
            nodes[selectedNode].addSample("B4");
        }
        else if (event.keyCode === 75) { // K
            nodes[selectedNode].addSample("C5");
        }
        else if (event.keyCode === 76) { // L
            nodes[selectedNode].addSample("D5");
        }
        else if (event.keyCode === 186) { // ;
            nodes[selectedNode].addSample("E5");
        }
        else if (event.keyCode === 87) { // W
            nodes[selectedNode].addSample("C#4");
        }
        else if (event.keyCode === 69) { // E
            nodes[selectedNode].addSample("D#4");
        }
        else if (event.keyCode === 84) { //
            nodes[selectedNode].addSample("F#4");
        }
        else if (event.keyCode === 89) { //
            nodes[selectedNode].addSample("G#4");
        }
        else if (event.keyCode === 85) { //
            nodes[selectedNode].addSample("A#4");
        }
        else if (event.keyCode === 65) { //

        }
        else if (event.keyCode === 65) { //

        }

        else if (event.keyCode === 66) { // B
            nodes[selectedNode].addSample("C0");
        }

    }
    else { // Not recording
        if (event.keyCode === 70) {     // F - STEP
            nodes[selectedNode].step();
        }
    }



});



