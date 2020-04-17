
// State
let isPlaying = false;


// Tone
let masterEnv;
let comp;
let reverb;
let delay;
let vibrato;
let filter;
let nodeConnectionPoint;

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
let viewScale = 1;

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
    addMultipleNodes(TEMP_NUM_NODES, NODE_TYPES.USER);
    addMultipleNodes(TEMP_NUM_NODES, NODE_TYPES.REMOTE);


    // Setup UI
    setupUI();

}


function draw() {

    background(COLOR_BACKGROUND);

    // Scale view
    translate(width/2, height/2);
    scale(viewScale);
    translate(-width/2, -height/2);

    // Translate view
    updateViewTranslationParameters();
    push();
    translate(viewOffsetX, viewOffsetY);
    nodeManager.drawNodes();
    pop();

}

// Overloads mousePressed of p5.
function mousePressed() {
    let nodes = nodeManager.getAllNodes();
    for (let node of nodes) {
        let correctedNodeX = ((node.x - width/2) * viewScale + width/2) + (viewOffsetX * viewScale) ;
        let correctedNodeY = ((node.y - height/2) * viewScale + height/2) + (viewOffsetY * viewScale);
        let distance = dist(mouseX, mouseY, correctedNodeX, correctedNodeY);
        if (distance < NODE_SIZE * viewScale) {
            nodeManager.setSelectedNode(node.getId());
            console.log('Selected Node:', node.getId());
        }
    }
}

/*
 * Overloads mouseWheel of p5.
 * Controls view scaling.
 */
function mouseWheel(event) {
    viewScale = Math.min(Math.max(viewScale + event.delta * VIEW_SCALE_FACTOR, VIEW_SCALE_MIN), VIEW_SCALE_MAX);
}


/*
 *  Handles translation of the canvas. Updates viewOffsetX and viewOffsetY.
 */
function updateViewTranslationParameters() {
    if (mouseX === 0 && mouseY === 0) // Hack to avoid translation when page is reloaded.
        return;
    if (mouseX > width - VIEW_TRANSLATION_MARGIN) { // right
        viewOffsetX = Math.max(view_min_x_offset, viewOffsetX-VIEW_TRANSLATION_SPEED);
    }
    if (mouseX < VIEW_TRANSLATION_MARGIN) { //left
        viewOffsetX = Math.min(view_max_x_offset, viewOffsetX+VIEW_TRANSLATION_SPEED);
    }
    if (mouseY > height-VIEW_TRANSLATION_MARGIN) { // bottom
        viewOffsetY = Math.max(view_min_y_offset, viewOffsetY-VIEW_TRANSLATION_SPEED);
    }
    if (mouseY < VIEW_TRANSLATION_MARGIN) { // top
        viewOffsetY = Math.min(view_max_y_offset, viewOffsetY+VIEW_TRANSLATION_SPEED);
    }
}


let __temp_id = 0; //TODO: Properly set id later.
function addMultipleNodes(numNodes, type) {
    for (let i=0; i<numNodes; i++) {
        addNode(__temp_id++, type);
    }
}

/*
 * Creates and adds a node to the view such that it doesn't overlap with existing nodes.
 */
function addNode(id, type) {
    let viewWidth = view_max_x_offset - view_min_x_offset;
    let viewHeight = view_max_y_offset - view_min_y_offset;
    let totalInterNodeDistance = NODE_SIZE * 2 + MIN_INTER_NODE_DIST;
    let nodes = nodeManager.getAllNodes();
    let newX, newY;
    let overlap = false;
    let added = false;

    while (!added) { // Possibility of infinite loop !!
        console.log('in addNode()');
        newX = random(NODE_SIZE, viewWidth - NODE_SIZE);
        newY = random(NODE_SIZE, viewHeight - NODE_SIZE);
        // newX = width/2;
        // newY = height/2;
        // Check for overlap with all existing nodes
        for (let j=0; j<nodes.length; j++) {
            overlap = dist(newX, newY, nodes[j].x, nodes[j].y) < totalInterNodeDistance;
            if (overlap)
                break;
        }
        if (!overlap) {
            //let synths = Object.keys(SYNTH_CONFIGS);
            nodeManager.createNode(id, type, newX, newY, NODE_SIZE, SYNTH_CONFIGS['square']); //TODO: Replace Temp Synth initialization with player.
            nodeManager.connectNode(id, nodeConnectionPoint);
            added = true;
        }
    }
}


/*
 *  Sets up the audio pipeline.
 *  Sets global variable 'nodeConnectionPoint' to where.
 */
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
        frequency  : 1700 ,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    });

    filter.connect(vibrato);

    Tone.Transport.scheduleRepeat((time)=>{
        nodeManager.stepAllNodes();
    }, "8n");
    Tone.Transport.bpm.value = 60;

    // Set global node connection point
    nodeConnectionPoint = filter;

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

    btnClear = createButton("Clear Node");
    btnClear.size(btnWidth, btnHeight);
    btnClear.position(width/2 - btnWidth - 20, height - 150);
    btnClear.addClass("myButton");
    btnClear.mousePressed(clearNode);
    btnClear.html("Clear Node");

}

function clearNode() {
    nodeManager.getSelectedNode().clearSamples();
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

    // if (event.keyCode === 80) {     // P - START TONE.JS
    //     Tone.start();
    //     console.log('Tone started');
    //     Tone.Master.volume = -10;
    // }


    if (event.keyCode === 65) { // A
        nodeManager.addSampleToSelectedNode("C4");
    }
    else if (event.keyCode === 83) { // S
        nodeManager.addSampleToSelectedNode("D4");
    }
    else if (event.keyCode === 68) { // D
        nodeManager.addSampleToSelectedNode("E4");
    }
    else if (event.keyCode === 70) { // F
        nodeManager.addSampleToSelectedNode("F4");
    }
    else if (event.keyCode === 71) { // G
        nodeManager.addSampleToSelectedNode("G4");
    }
    else if (event.keyCode === 72) { // H
        nodeManager.addSampleToSelectedNode("A4");
    }
    else if (event.keyCode === 74) { // J
        nodeManager.addSampleToSelectedNode("B4");
    }
    else if (event.keyCode === 75) { // K
        nodeManager.addSampleToSelectedNode("C5");
    }
    else if (event.keyCode === 76) { // L
        nodeManager.addSampleToSelectedNode("D5");
    }
    else if (event.keyCode === 186) { // ;
        nodeManager.addSampleToSelectedNode("E5");
    }
    else if (event.keyCode === 87) { // W
        nodeManager.addSampleToSelectedNode("C#4");
    }
    else if (event.keyCode === 69) { // E
        nodeManager.addSampleToSelectedNode("D#4");
    }
    else if (event.keyCode === 84) { // T
        nodeManager.addSampleToSelectedNode("F#4");
    }
    else if (event.keyCode === 89) { // Y
        nodeManager.addSampleToSelectedNode("G#4");
    }
    else if (event.keyCode === 85) { // U
        nodeManager.addSampleToSelectedNode("A#4");
    }
    else if (event.keyCode === 79) { // O
        nodeManager.addSampleToSelectedNode("C#5");
    }
    else if (event.keyCode === 80) { // P
        nodeManager.addSampleToSelectedNode("D#5");
    }
    else if (event.keyCode === 32) { // SPACE
        nodeManager.addSampleToSelectedNode(null); // Rest
    }

    if (!isPlaying) { // Not playing
        if (event.keyCode === 188) {     // ,
            nodeManager.getSelectedNode().stepBackward();
        }
        if (event.keyCode === 190) {     // . STEP
            nodeManager.getSelectedNode().stepForward();
        }
    }
});



