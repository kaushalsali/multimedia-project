
class NodeManager {

    constructor() {
        this.nodes = {};
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

    createNode(nodeId, x, y, size, synth_config) {
        if (!(nodeId in Object.keys(this.nodes)))
            this.nodes[nodeId] = new Node(nodeId, x, y, size, synth_config);
        else
            console.log('ERROR: Node with id: ' + nodeId + ' already exists.')
    }

    deleteNode(nodeId) {
        if (nodeId in Object.keys(this.nodes))
            delete this.nodes[nodeId];
        else
            console.log('ERROR: Node with id: ' + nodeId + ' does not exists.')
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

    getSelectedNode() {
        return this.nodes[this.selectedNodeId];
    }

    connectNode(nodeId, where) {
        this.nodes[nodeId].connectSynth(where);
    }

}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

class Node {

    constructor(id, x, y, size, synth_config) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.numSamples = 0;
        this.samples = [];
        this.currentSample = -1;
        this.sectorAngle = 2 * PI / this.numSamples;
        this.nodeFaceColor = COLOR_NODE_FACE;
        this.selected = false;
        this.direction = 1;

        this.synth = new NodeSynth(synth_config);
        this.interval = 0.3;
    }

    getId() {
        return this.id;
    }

    isSelected() {
        return this.selected;
    }

    setSelected(bool) {
        this.selected = bool;
    }

    setNodeFaceColor(colorValues) {
        this.nodeFaceColor = colorValues;
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

    setInterval(interval) {
        this.interval = interval;
    }

    setReleaseTime(releaseTime) {
        this.synth.setReleaseTime(releaseTime);
    }

    setAttackTime(attackTime) {
        this.synth.setAttackTime(attackTime);
    }


    playSample(sample, interval) {
        this.synth.playNote(sample, interval);
    }

    step() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + this.direction) % this.numSamples;
            this.playSample(this.samples[this.currentSample], this.interval);
        }
    }

    stepForward() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + 1) % this.numSamples;
            this.playSample(this.samples[this.currentSample], this.interval);
        }
    }

    stepBackward() {
        if (this.hasSample()) {
            this.currentSample = (this.currentSample + this.numSamples - 1) % this.numSamples;
            this.playSample(this.samples[this.currentSample], this.interval);
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
            fill(COLOR_NO_SAMPLE);
            ellipse(0, 0, this.size);
        }
        else {
            for (let i = 0; i < this.numSamples; i++) {
                if (this.currentSample === i)
                    fill(COLOR_CURRENT_SAMPLE);
                else
                    fill(COLOR_DEFAULT_SAMPLE);
                arc(0, 0, this.size, this.size, this.sectorAngle * i, this.sectorAngle * (i + 1), PIE);
            }
        }

        // Node face
        strokeWeight(2);
        stroke(0);
        fill(COLOR_NODE_FACE);
        ellipse(0, 0,  this.size * 0.85);
        fill(this.nodeFaceColor);
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

        pop();
    }


    // Unused for now
    // Redraws only the current and previous sector. Less expensive function
    drawArc() {
        translate(this.x, this.y);
        fill(COLOR_CURRENT_SAMPLE);
        arc(0, 0, this.size, this.size, this.sectorAngle * this.currentSample, this.sectorAngle * (this.currentSample + 1), PIE);

        let lastSample = ((this.currentSample - 1 + this.numSamples) % this.numSamples);
        fill(COLOR_DEFAULT_SAMPLE);
        arc(0, 0, this.size, this.size, this.sectorAngle * lastSample, this.sectorAngle * this.currentSample, PIE);
    }
}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

class NodeSynth {

    constructor(synth_config) {
        this.synth = new Tone.Synth(synth_config);
    }

    connect(where) {
        this.synth.connect(where);
    }

    getEnvelope() {
        return this.envelope;
    }

    setEnvelope(envelope) {
        this.synth.set({"envelope": this.envelope});
    }

    setReleaseTime(releaseTime) {
        this.synth.set({"envelope": {"release": releaseTime}});
    }

    setAttackTime(attackTime) {
        this.synth.set({"envelope": {"attack": attackTime}});
    }


    playNote(note, interval) {
        this.synth.triggerAttackRelease(note, interval);
    }
}
