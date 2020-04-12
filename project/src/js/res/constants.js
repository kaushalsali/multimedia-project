// View paramerters
const VIEW_TRANSLATION_SPEED = 5;
const VIEW_TRANSLATION_MARGIN = 50;
const VIEW_SCALE_FACTOR = 0.001;
const VIEW_SCALE_MAX = 3;
const VIEW_SCALE_MIN = 0.2;


// Node
const NODE_SIZE = 120;
const MAX_SAMPLES = 64;
const MIN_INTER_NODE_DIST = 100;

//Temp variables //TODO: Delete later
const TEMP_NUM_NODES = 4;

// Colors
const COLOR_BACKGROUND = [30, 30, 30];
let alpha = 200;

const COLOR_NODE_FACE = [17, 17, 17];
const COLOR_DEFAULT_SAMPLE = [255, 165, 69];
const COLOR_CURRENT_SAMPLE = [255, 85, 0];
const COLOR_NO_SAMPLE = [51, 37, 0];

const COLOR_BLACK = [0, 0, 0];


const SYNTH_CONFIGS = {
    "square": {
        oscillator  : {
            type  : "square"
        }  ,
        envelope  : {
            attack  : 0.0001 ,
                decay  : 0.001 ,
                sustain  : 0.5,
                release  : 3,
        }
    },
    "sine": {
        oscillator  : {
            type  : "sine"
        }  ,
        envelope  : {
            attack  : 0.0001 ,
            decay  : 0.001 ,
            sustain  : 0.5,
            release  : 3,
        }
    }
};