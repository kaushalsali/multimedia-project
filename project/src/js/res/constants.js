

// Node
NODE_SIZE = 120;
MAX_SAMPLES = 64;

// Colors
const COLOR_BACKGROUND = [30, 30, 30];
let alpha = 200;

const COLOR_NODE_FACE = [17, 17, 17];
const COLOR_DEFAULT_SAMPLE = [255, 165, 69];
const COLOR_CURRENT_SAMPLE = [255, 85, 0];
const COLOR_NO_SAMPLE = [51, 37, 0];

const COLOR_BLACK = [0, 0, 0];


const SYNTH_CONFIG = {
    oscillator  : {
        type  : "square"
    }  ,
    envelope  : {
        attack  : 0.0001 ,
        decay  : 0.001 ,
        sustain  : 0.5,
        release  : 3,
    }
}

// Animation colors
const COLOR_ANIM_BACKGROUND = [];
const COLOR_ANIM_LIGHTNING = 'rgba(255,255,255,5)';
