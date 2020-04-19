// View paramerters
const VIEW_TRANSLATION_SPEED = 5;
const VIEW_TRANSLATION_MARGIN = 50;
const VIEW_SCALE_FACTOR = 0.001;
const VIEW_SCALE_MAX = 3;
const VIEW_SCALE_MIN = 0.2;

//---------------------------------------------------------------------------------
// Node
const NODE_SIZE = 138;
const MAX_SAMPLES = 64;
const MIN_INTER_NODE_DIST = 100;

//---------------------------------------------------------------------------------
//Temp variables //TODO: Delete later
const TEMP_NUM_NODES = 4;

//---------------------------------------------------------------------------------
// Colors
const COLOR_BACKGROUND = [30, 30, 30];

const COLOR_NODE_FACE = [17, 17, 17];
const COLOR_DEFAULT_SAMPLE = [255, 165, 69];
const COLOR_CURRENT_SAMPLE = [255, 85, 0];
const COLOR_NO_SAMPLE = [51, 37, 0];

const COLOR_ANIM_BACKGROUND = [];
const COLOR_ANIM_LIGHTNING = 'rgba(255,255,255,5)';
//Light, medium, and dark versions for animations with color gradients;
const COLOR_REDS=[[255,178,176],[255,72,69],[197,10,1]];
const COLOR_YELLOWS=[[255,255,180],[255,255,69],[223,189,9]];
const COLOR_ORANGEYELLOW=[[255,208,157],[255,165,69],[188,98,2]];
const COLOR_ORANGE=[[255,183,148],[255,85,0],[153,56,0]];
const COLOR_BLUES=[[163,186,255],[0,0,245],[0,2,103]];
const COLOR_PURPLES=[[219,168,255],[134,0,230],[48,0,86]];
const COLOR_GREENS=[[201,255,201],[0,204,0],[0,71,0]];

const COLOR_BLACK = [0, 0, 0];

//---------------------------------------------------------------------------------
// Synth configs
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


//---------------------------------------------------------------------------------
const ANIM_MAPPING = {
  'C4': 'this.lightning.draw()',
  'C#4': 'null',
  'D4': 'null',
  'D#4': 'null',
  'E4': 'null',
  'F4': 'null',
  'F#4': 'null',
  'G4': 'null',
  'G#4': 'null',
  'A4': 'null',
  'A#4': 'null',
  'B4': 'null',
  'C5': 'null',
  'C#5': 'null',
  'D5': 'null',
  'D#5': 'null',
  'E5': 'null'
}
