
class Node {

    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.numSamples = 0;
        this.samples = [];
        this.currentSample = -1;
        this.sectorAngle = 2 * PI / this.numSamples;
        this.nodeFaceColor = COLOR_NODE_FACE;

        this.synth = new NodeSynth();
        this.interval = 0.3;
    }

    setNodeFaceColor(colorValues) {
        this.nodeFaceColor = colorValues;
    }

    getSamples() {
        return this.samples;
    }

    clearSamples() {
        this.samples = [];
        this.numSamples = 0;
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
        if (this.numSamples === 0)
            this.currentSample = -1;
        else
            this.currentSample = (this.currentSample + 1) % this.numSamples;

        // Play sample
        this.playSample(this.samples[this.currentSample], this.interval);
        animationHandler(this.samples[this.currentSample]);
    }

    draw() {
        translate(this.x, this.y);
        strokeWeight(2);
        stroke(0);

        if (this.numSamples === 0) {
            fill(COLOR_NO_SAMPLE);
            ellipse(0, 0,  this.size);
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

        ellipseMode(RADIUS);
        strokeWeight(2);
        stroke(0);
        fill(COLOR_NODE_FACE);
        ellipse(0, 0,  this.size - 20);
        fill(this.nodeFaceColor);
        ellipse(0, 0,  this.size - 20);

        fill([0,0,0,0]);
        strokeWeight(0.3);

        let gray = 0.2125 * this.nodeFaceColor[0] + 0.7154 * this.nodeFaceColor[1] + 0.0721* this.nodeFaceColor[2]; //0.0721

        if (gray > 100)
            stroke(0);
        else
            stroke(100);
        let numCircles = 10;
        let size = this.size - 20;
        for (let i=1; i<numCircles; i++)
            ellipse(0, 0,  size - (size/numCircles)*i);

        animationDraw();

        test((this.size - 25), 1);

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


class NodeSynth {
    constructor() {
        this.synth = new Tone.Synth(SYNTH_CONFIG);
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
