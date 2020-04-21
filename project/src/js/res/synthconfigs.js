const SYNTH = {
    MID: "Mid",
    LOW: "Low",
    HIGH: "High"
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
        detune: -5
    },
    oscillator3: {
        type: "sawtooth",
        volume: -6,
        detune: 5
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
            frequency: 5,
            min: 300,
            max: 400,
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
        type: "sine",
        volume: -6
    },
    oscillator2: {
        type: "sine",
        volume: -6,
        detune: 0
    },
    oscillator3: {
        type: "sine",
        volume: -6,
        detune: 0
    },
    envelope: {
        attack: 0.1,
        decay: 0.01,
        sustain: 0.8,
        release: 0.1,
    },
    filter: {
        type: "lowpass",
        frequency: 10000,
        rolloff: -12 ,
        Q: 1 ,
        gain: 0
    },
    // lfo: {
    //     config: {
    //         type: "sine",
    //         frequency: "4n",
    //         min: 0,
    //         max: 1,
    //         amplitude: 1
    //     },
    //     connectTo: {
    //         "filter": "frequency"
    //     }
    // },
    noteDuration: 0.3,
    octaveShift: [-1, -2, -2]
};


SYNTH_CONFIGS[SYNTH.HIGH] = {
    oscillator1: {
        type: "triangle",
        volume: -6
    },
    oscillator2: {
        type: "sine",
        volume: -6
    },
    envelope: {
        attack: 0.1,
        decay: 0.001,
        sustain: 0.5,
        release: 1,
    },
    filter: {
        type  : "lowpass",
        frequency  : 2000,
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
    //     connectTo: {
    //         "filter": "frequency"
    //     }
    // },
    noteDuration: 0.3,
    octaveShift: [2, 2, 2]
};

