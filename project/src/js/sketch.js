
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



function setup() {
    // Setup canvas
    let myCanvas = createCanvas(100,100);
    resizeCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent('canvas-container');
    background(COLOR_BACKGROUND);

    // Tone Setup
    setupTone();

    // Create Nodes
    for (let i=0; i<numNodes; i++) {
        nodes[i] = new Node(width / 2, height / 2, NODE_SIZE);
        nodes[i].connectSynth(filter);
    }

    // Setup UI
    setupUI();

}


function draw() {

    background(COLOR_BACKGROUND);

    for (let i=0; i<numNodes; i++)
        nodes[i].draw();

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
    }

    if (!isPlaying) { // Not playing
        if (event.keyCode === 70) {     // F - STEP
            console.log('asd');
            nodes[selectedNode].step();
        }
    }
});



