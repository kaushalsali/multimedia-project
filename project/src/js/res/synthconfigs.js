const SYNTH = {
    MID: "Mid",
    LOW: "Low"
};

const SYNTH_CONFIGS = {};

SYNTH_CONFIGS[SYNTH.MID] = {
    oscillator1: {
        type: "sawtooth",
        volume: -6,
    },
    oscillator2: {
        type: "sawtooth",
        volume: -6,
        detune: -10
    },
    oscillator3: {
        type: "sawtooth",
        volume: -6,
        detune: 10
    },
    envelope: {
        attack: 0.01,
        decay: 0.001,
        sustain: 0.5,
        release: 0.1,
    },
    filter: {
        type  : "lowpass",
        frequency  : 500,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 10,
            min: 300,
            max: 600,
            amplitude: 1
        },
        connectTo: {
            "filter": "frequency"
        }
    },
    noteDuration: 0.3,
    octaveShift: [0, 0, 0]  // [osc1, osc2, osc3]
};




SYNTH_CONFIGS[SYNTH.LOW] = {
    oscillator1: {
        type: "square",
        volume: -6
    },
    oscillator2: {
        type: "sawtooth",
        volume: -6
    },
    envelope: {
        attack: 0.01,
        decay: 0.001,
        sustain: 0.5,
        release: 0.1,
    },
    filter: {
        type  : "lowpass",
        frequency  : 22050,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    },
    // lfo: {
    //     config: {
    //         type: "sine",
    //         frequency: "4n",
    //         min: 0,
    //         max: 1,
    //         amplitude: 1
    //     },
    //     connectTo: null
    // },
    noteDuration: 0.3,
    octaveShift: [0, 0, 0]
};



