
let numNodes = 7;
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

// Global view parameters
let view_max_offset = 1000;
let view_min_offset = 0;
let view_x_offset = 0;
let view_y_offset = 0;
let view_scale = 0;



function setup() {
    // Setup canvas
    let myCanvas = createCanvas(100,100);
    resizeCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent('canvas-container');
    background(COLOR_BACKGROUND);

    view_max_offset = height;
    view_min_offset = -height;

    // Tone Setup
    setupTone();

    // Create Nodes
    createNodes(numNodes, 100);

    // Setup UI
    setupUI();

}


function draw() {


    background(COLOR_BACKGROUND);

    updateView();

    for (let i=0; i<numNodes; i++)
        nodes[i].draw(view_x_offset, view_y_offset);
}


/*
 * Creates and adds nodes to the view such that they dont overlap.
 */
function createNodes(numNodes, minInterNodeDist=0) {
    let totalInterNodeDistance = NODE_SIZE * 2 + minInterNodeDist;
    let view_width = view_max_offset - view_min_offset;
    let view_height = view_max_offset - view_min_offset;

    // Add first node
    let new_x = random(NODE_SIZE, view_width - NODE_SIZE);
    let new_y = random(NODE_SIZE, view_height - NODE_SIZE);
    nodes.push(new Node(new_x, new_y, NODE_SIZE));

    while (nodes.length < numNodes) {
        let overlap = false;
        new_x = random(NODE_SIZE, view_width - NODE_SIZE);
        new_y = random(NODE_SIZE, view_height - NODE_SIZE);

        for (let j=0; j<nodes.length; j++) { // Check for overlap with all previous nodes
            overlap = dist(new_x, new_y, nodes[j].x, nodes[j].y) < totalInterNodeDistance;
            if (overlap)
                break;
        }
        if (!overlap) {
            nodes.push(new Node(new_x, new_y, NODE_SIZE));
        }
    }

}

/*
 *  Handles scrolling of the canvas. Updates view_x_offset and view_y_offset.
 */
function updateView() {
    if (mouseX > width - VIEW_SCROLL_MARGIN) { // right
        view_x_offset = Math.max(view_min_offset, view_x_offset-VIEW_SCROLL_SPEED);
    }
    if (mouseX < VIEW_SCROLL_MARGIN) { //left
        view_x_offset = Math.min(view_max_offset, view_x_offset+VIEW_SCROLL_SPEED);
    }
    if (mouseY > height-VIEW_SCROLL_MARGIN) { // bottom
        view_y_offset = Math.max(view_min_offset, view_y_offset-VIEW_SCROLL_SPEED);
    }
    if (mouseY < VIEW_SCROLL_MARGIN) { // top
        view_y_offset = Math.min(view_max_offset, view_y_offset+VIEW_SCROLL_SPEED);
    }
    //console.log('scroll: ' + view_x_offset + " " + view_y_offset);
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



