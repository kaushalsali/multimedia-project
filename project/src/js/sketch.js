
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
let view_max_x_offset = 1000;
let view_min_x_offset = 0;
let view_max_y_offset = 1000;
let view_min_y_offset = 0;
let viewOffsetX = 0;
let viewOffsetY = 0;
let view_scale = 0;

// Node parameters
let nodeManager = null;



function setup() {
    // Setup canvas
    let myCanvas = createCanvas(100,100);
    resizeCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent('canvas-container');
    background(COLOR_BACKGROUND);

    // Set view limits
    view_max_x_offset = width/2;
    view_min_x_offset = -width/2;
    view_max_y_offset = height/2;
    view_min_y_offset = -height/2;

    // Tone Setup
    setupTone();

    // Create Nodes
    nodeManager = new NodeManager();
    addMultipleNodes(TEMP_NUM_NODES);

    // Setup UI
    setupUI();

}


function draw() {

    background(COLOR_BACKGROUND);

    updateView();

    nodeManager.drawNodes(viewOffsetX, viewOffsetY);
}


/*
 * Creates and adds nodes to the view such that they dont overlap.
 */
function addMultipleNodes(numNodes) {
    let __temp_id = 0; //TODO: Properly set id later.
    for (let i=0; i<numNodes; i++) {
        addNode(__temp_id++);
    }
}

function addNode(id) {
    let viewWidth = view_max_x_offset - view_min_x_offset;
    let viewHeight = view_max_y_offset - view_min_y_offset;
    let totalInterNodeDistance = NODE_SIZE * 2 + MIN_INTER_NODE_DIST;
    let nodes = nodeManager.getAllNodes();
    let newX, newY;
    let overlap = false;
    let added = false;

    while (!added) { // Possibility of infinite loop !!
        newX = random(NODE_SIZE, viewWidth - NODE_SIZE);
        newY = random(NODE_SIZE, viewHeight - NODE_SIZE);

        // Check for overlap with all existing nodes
        for (let j=0; j<nodes.length; j++) {
            overlap = dist(newX, newY, nodes[j].x, nodes[j].y) < totalInterNodeDistance;
            if (overlap)
                break;
        }
        if (!overlap) {
            nodeManager.createNode(id, newX, newY, NODE_SIZE);
            added = true;
        }
    }
}

/*
 *  Handles scrolling of the canvas. Updates viewOffsetX and viewOffsetY.
 */
function updateView() {
    if (mouseX === 0 && mouseY === 0) // Hack to avoid scrolling when page is reloaded.
        return;
    if (mouseX > width - VIEW_SCROLL_MARGIN) { // right
        viewOffsetX = Math.max(view_min_x_offset, viewOffsetX-VIEW_SCROLL_SPEED);
    }
    if (mouseX < VIEW_SCROLL_MARGIN) { //left
        viewOffsetX = Math.min(view_max_x_offset, viewOffsetX+VIEW_SCROLL_SPEED);
    }
    if (mouseY > height-VIEW_SCROLL_MARGIN) { // bottom
        viewOffsetY = Math.max(view_min_y_offset, viewOffsetY-VIEW_SCROLL_SPEED);
    }
    if (mouseY < VIEW_SCROLL_MARGIN) { // top
        viewOffsetY = Math.min(view_max_y_offset, viewOffsetY+VIEW_SCROLL_SPEED);
    }
    //console.log('scroll: ' + viewOffsetX + " " + viewOffsetY);
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



