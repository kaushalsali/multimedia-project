// View paramerters
const VIEW_TRANSLATION_SPEED = 10;
const VIEW_TRANSLATION_MARGIN = 50;
const VIEW_SCALE_FACTOR = 0.001;
const VIEW_SCALE_MAX = 2;
const VIEW_SCALE_MIN = 0.4;

//---------------------------------------------------------------------------------
// Node

const NODE_SIZE = 138;
const MAX_USER_NODES = 100;
const MAX_TOTAL_NODES = 100;
const MAX_SAMPLES = 64;
const MIN_INTER_NODE_DIST = 50;
const DEFAULT_SYNTH = SYNTH.MID;
const NODE_TYPES = {
    USER: 'user',
    REMOTE: 'remote'
};


//---------------------------------------------------------------------------------
//Temp variables //TODO: Delete later
const TEMP_NUM_NODES = 2;


//---------------------------------------------------------------------------------
// Colors
const COLOR_BACKGROUND = [30, 30, 30];
const COLOR_BACKGROUND_VIEW = [20, 20, 20];

const COLOR_NODE = {
    'user': {
        FACE: [17, 17, 17],
        DEFAULT_SAMPLE: [255, 165, 69],
        CURRENT_SAMPLE: [255, 85, 0],
        NO_SAMPLE: [51, 37, 0]
    },
    'remote': {
        FACE: [17, 17, 17],
        DEFAULT_SAMPLE: [247, 29, 7],
        CURRENT_SAMPLE: [255, 85, 0],
        NO_SAMPLE: [50, 8, 0]
    }
};

const COLOR_ANIM_BACKGROUND = [];
const COLOR_ANIM_LIGHTNING = 'rgba(255,255,255,5)';
//Light, medium, and dark versions for animations with color gradients;
const COLOR_REDS=[[255,178,176],[255,72,69],[197,10,1]];
const COLOR_YELLOWS=[[255,255,180],[255,255,69],[223,189,9]];
const COLOR_ORANGEYELLOW=[[255,208,157],[255,165,69],[188,98,2]];
const COLOR_ORANGE=[[255,183,148],[255,85,0],[153,56,0]];
const COLOR_BLUES=[[163,186,255],[0,0,245],[0,2,103]];
const COLOR_PURPLES=[[219,168,255,255],[134,0,230, 255],[48,0,86, 255]];
const COLOR_GREENS=[[201,255,201],[0,204,0],[0,71,0]];

const COLOR_BLACK = [0, 0, 0];

//---------------------------------------------------------------------------------
// Synth configs



//---------------------------------------------------------------------------------
const ANIM = {
    LIGHTNING: "lightning",
    EMPTY_CIRCLE: "unfilled expanding cirecle",
    FADE_ORANGE: "circleFade with orange",
    ROT_STAR_GREEN: "green gradient rotating star",
    STROBE_BLUE: "blue circleStrobe",
    SPIRAL_BLUE: "blue spiral",
    VERT_PURPLE: "purple vertical lines",
    STATIC_STAR_ORANGE: "orange static star",
    RAD_PURPLE: "purple radiateLines",
    ACROSS_PURPLE: "fill Across"
};

const ANIM_MAPPINGS = {
  'C4': ANIM.LIGHTNING,
  'C#4': ANIM.EMPTY_CIRCLE,
  'D4': ANIM.FADE_ORANGE,
  'D#4': ANIM.ROT_STAR_GREEN,
  'E4': ANIM.STROBE_BLUE,
  'F4': ANIM.SPIRAL_BLUE,
  'F#4': ANIM.VERT_PURPLE,
  'G4': ANIM.STATIC_STAR_ORANGE,
  'G#4': ANIM.RAD_PURPLE,
  'A4': ANIM.ACROSS_PURPLE,
  'A#4': 'null',
  'B4': 'null',
  'C5': 'null',
  'C#5': 'null',
  'D5': 'null',
  'D#5': 'null',
  'E5': 'null'
}
