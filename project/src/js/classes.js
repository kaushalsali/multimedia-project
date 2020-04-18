
class NodeManager {

    constructor() {
        this.nodes = {};
        this.userNodeIds = [];
        this.remoteNodeIds = [];
        this.selectedNodeId = 0;
    }

    getNumNodes() {
        return Object.keys(this.nodes).length;
    }

    getNode(nodeId) {
        return this.nodes[nodeId];
    }

    getAllNodes() {
        return Object.values(this.nodes);
    }

    getAllNodeIds(){
        return Object.keys(this.nodes);
    }

    getUserNodes() {
        return this.userNodeIds.map( (id) => {return this.nodes[id];})
    }

    getUserNodeIds() {
        return this.userNodeIds;
    }

    getRemoteNodes() {
        return this.remoteNodeIds.map( (id) => {return this.nodes[id];})
    }

    getRemoteNodeIds() {
        return this.remoteNodeIds;
    }

    createNode(nodeId, nodeType, x, y, size, synth_config) {
        if (!(nodeId in Object.keys(this.nodes))) {
            this.nodes[nodeId] = new Node(nodeId, nodeType, x, y, size, synth_config);
            if (nodeType === NODE_TYPES.REMOTE)
                this.remoteNodeIds.push(nodeId);
            else if (nodeType === NODE_TYPES.USER)
                this.userNodeIds.push(nodeId);
        }
        else
            console.log('ERROR: Node with id: ' + nodeId + ' already exists.')
    }

    deleteNode(nodeId) {
        if (nodeId in Object.keys(this.nodes)) {
            let type = this.nodes[nodeId].getType();
            if (type === NODE_TYPES.USER)
                this.userNodeIds.splice(this.userNodeIds.indexOf(nodeId), 1);
            else if (type === NODE_TYPES.REMOTE)
                this.remoteNodeIds.splice(this.remoteNodeIds.indexOf(nodeId), 1);
            delete this.nodes[nodeId];
        }
        else
            console.log('ERROR: Node with id: ' + nodeId + ' does not exists.')
    }

    addSampleToUserNode(nodeId, sample) {
        if (nodeId in this.userNodeIds)
            this.nodes[nodeId].addSample(sample)
    }

    addSampleToRemoteNode(nodeId, sample) {
        if (nodeId in this.remoteNodeIds)
            this.nodes[nodeId].addSample(sample)
    }

    clearUserNode(nodeId) {
        if (nodeId in this.userNodeIds)
            this.nodes[nodeId].clearSamples();
    }

    clearRemoteNode(nodeId) {
        if (nodeId in this.remoteNodeIds)
            this.nodes[nodeId].clearSamples();
    }

    drawNodes() {
        for (let nodeId in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeId))
                this.nodes[nodeId].draw();
        }
    }

    stepAllNodes() {
        for (let nodeId in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeId))
                this.nodes[nodeId].step();
        }
    }

    setSelectedNode(nodeId) {
        this.nodes[this.selectedNodeId].setSelected(false);
        this.selectedNodeId = nodeId;
        this.nodes[this.selectedNodeId].setSelected(true);
    }

    getSelectedNodeId() {
        return this.selectedNodeId;
    }

    connectNode(nodeId, where) {
        this.nodes[nodeId].connectSynth(where);
    }

}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

class Node {

    constructor(id, type, x, y, size, synth_config) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.numSamples = 0;
        this.samples = [];
        this.currentSample = -1;
        this.sectorAngle = 2 * PI / this.numSamples;
        this.selected = false;
        this.direction = 1;

        this.synth = new NodeSynth(synth_config);
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    isSelected() {
        return this.selected;
    }

    setSelected(bool) {
        this.selected = bool;
    }

    hasSample() {
        return this.samples.length > 0;
    }

    getSamples() {
        return this.samples;
    }

    clearSamples() {
        this.samples = [];
        this.numSamples = 0;
        this.currentSample = -1;
    }

    addSample(sample) {
        this.numSamples = Math.min(this.numSamples + 1, MAX_SAMPLES);
        this.sectorAngle = 2 * PI / this.numSamples;
        this.samples.push(sample);
    }

    removeSample() {
        this.numSamples = Math.max(0, this.numSamples - 1);
        this.sectorAngle = 2 * PI / this.numSamples;
        this.samples.pop();
    }

    connectSynth(where) {
        this.synth.connect(where);
    }

    playSample(sample) {
        if (sample)
            this.synth.playNote(sample);
    }

    step() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + this.direction) % this.numSamples;
            this.playSample(this.samples[this.currentSample]);
        }
    }

    stepForward() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + 1) % this.numSamples;
            this.playSample(this.samples[this.currentSample]);
        }
    }

    stepBackward() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + this.numSamples - 1) % this.numSamples;
            this.playSample(this.samples[this.currentSample]);
        }
    }

    changeDirection() {
        this.direction = !this.direction;
    }

    draw() {
        push();
        translate(this.x, this.y);
        strokeWeight(2);
        stroke(0);
        ellipseMode(RADIUS);

        // Node sample tray
        if (this.numSamples === 0) {
            fill(COLOR_NODE[this.type].NO_SAMPLE);
            ellipse(0, 0, this.size);
        }
        else {
            for (let i = 0; i < this.numSamples; i++) {
                if (this.currentSample === i)
                    fill(COLOR_NODE[this.type].CURRENT_SAMPLE);
                else
                    fill(COLOR_NODE[this.type].DEFAULT_SAMPLE);
                arc(0, 0, this.size, this.size, this.sectorAngle * i, this.sectorAngle * (i + 1), PIE);
            }
        }

        // Node face
        strokeWeight(2);
        stroke(0);
        fill(COLOR_NODE[this.type].FACE);
        ellipse(0, 0,  this.size * 0.85);

        // Inner gray circles
        strokeWeight(1);
        if (this.isSelected())
            stroke(70);
        else
            stroke(10);
        let numCircles = 10;
        let size = this.size  * 0.85;
        for (let i=1; i<numCircles; i++)
            ellipse(0, 0,  size - (size/numCircles)*i);

        // TODO: Integrate animations
        // animationDraw(this.samples[this.currentSample]);
        // test((this.size - 25), 1);

        pop();
    }


    // Unused for now
    // Redraws only the current and previous sector. Less expensive function
    drawArc() {
        translate(this.x, this.y);
        fill(COLOR_NODE[this.type].CURRENT_SAMPLE);
        arc(0, 0, this.size, this.size, this.sectorAngle * this.currentSample, this.sectorAngle * (this.currentSample + 1), PIE);

        let lastSample = ((this.currentSample - 1 + this.numSamples) % this.numSamples);
        fill(COLOR_NODE[this.type].DEFAULT_SAMPLE);
        arc(0, 0, this.size, this.size, this.sectorAngle * lastSample, this.sectorAngle * this.currentSample, PIE);
    }
}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

class NodeSynth {

    constructor(synthConfig) {
        this.octaveShift = synthConfig.octaveShift * 12;
        this.noteDuration = synthConfig.noteDuration;

        this.filter = new Tone.Filter(synthConfig.filter);

        this.ampEnv = new Tone.AmplitudeEnvelope(synthConfig.envelope);
        this.ampEnv.connect(this.filter);

        this.osc1 = new Tone.OmniOscillator(synthConfig.oscillator1);
        this.osc1.connect(this.ampEnv);
        this.osc1.start();

        if (synthConfig.oscillator2) {
            this.osc2 = new Tone.OmniOscillator(synthConfig.oscillator2);
            this.osc2.connect(this.ampEnv);
            this.osc2.start();
        }

        if (synthConfig.oscillator3) {
            this.osc3 = new Tone.OmniOscillator(synthConfig.oscillator3);
            this.osc3.connect(this.ampEnv);
            this.osc3.start();
        }
    }

    connect(where) {
        this.filter.connect(where);
    }

    playNote(note) {
        console.log(this);
        let freq = Tone.Frequency(note).transpose(this.octaveShift).toFrequency();
        this.osc1.frequency.value = freq;
        if (this.osc2)
            this.osc2.frequency.value = freq;
        if (this.osc3)
            this.osc3.frequency.value = freq;
        this.ampEnv.triggerAttackRelease(this.noteDuration);
    }
}
