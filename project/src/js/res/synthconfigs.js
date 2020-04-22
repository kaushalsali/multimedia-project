const SYNTH = {
    MID: "E. Piano",
    LOW: "Tuba",
    HIGH: "Bell",
    OCARINA: "Ocarina",
    OBOE: "Oboe",
    EBASS: "E. Bass"
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
        type: "square",
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
        frequency  : 600,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 4,
            min: 300,
            max: 600,
            amplitude: 3
        },
        connectTo: {
            "filter": "frequency"
        }
    },
    noteDuration: 0.25,
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
        attack: 0.2,
        decay: 0.01,
        sustain: 0.8,
        release: 0.15,
    },
    filter: {
        type: "lowpass",
        frequency: 10000,
        rolloff: -12 ,
        Q: 1 ,
        gain: 0
    },
     lfo: {
         config: {
             type: "sine",
             frequency: "3",
             min: -9,
             max: -6,
             amplitude: 1
         },
         connectTo: {
             "oscillator1": "volume"
         }
     },
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
    oscillator3: {
        type: "square",
        volume: -24,
        detune: 1
    },
    envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.1,
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

SYNTH_CONFIGS[SYNTH.OCARINA] = {
    oscillator1: {
        type: "sine",
        volume: -3,
    },
    oscillator2: {
        type: "triangle",
        volume: -6,
        detune: -1
    },
    oscillator3: {
        type: "triangle",
        volume: -9,
        detune: 1
    },
    envelope: {
        attack: 0.3,
        decay: 0.1,
        sustain: 0.4,
        release: 0.1,
    },
    filter: {
        type  : "bandpass",
        frequency  : 500,
        rolloff  : -12 ,
        Q  : 2,
        gain  : 1
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 12,
            min: -4,
            max: 4,
            amplitude: 1
        },
        connectTo: {
            "oscillator1": "detune",
        }
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 12,
            min: -9,
            max: -3,
            amplitude: 4
        },
        connectTo: {
            "oscillator1": "volume",
        }
    },
    noteDuration: 0.45,
    octaveShift: [3, 2, 1]  // [osc1, osc2, osc3]
};


SYNTH_CONFIGS[SYNTH.OBOE] = {
    oscillator1: {
        type: "sawtooth",
        volume: -3,
    },
    oscillator2: {
        type: "sine",
        volume: -12,
        detune: -1
    },
    oscillator3: {
        type: "triangle",
        volume: -24,
        detune: 1
    },
    envelope: {
        attack: 0.4,
        decay: 0.05,
        sustain: 0.6,
        release: 0.3,
    },
    filter: {
        type  : "bandpass",
        frequency  : 900,
        rolloff  : -12 ,
        Q  : 6,
        gain  : 1
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 90,
            min: -2,
            max: 2,
            amplitude: 1
        },
        connectTo: {
            "oscillator1": "detune",
        }
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 7,
            min: -12,
            max: -3,
            amplitude: 0.6
        },
        connectTo: {
            "oscillator1": "volume",
        }
    },
    noteDuration: 0.45,
    octaveShift: [0, 1, 1]  // [osc1, osc2, osc3]
};


SYNTH_CONFIGS[SYNTH.EBASS] = {
    oscillator1: {
        type: "triangle",
        volume: -3,
    },
    oscillator2: {
        type: "sine",
        volume: -12,
        detune: -1
    },
    oscillator3: {
        type: "sine",
        volume: -24,
        detune: 1
    },
    envelope: {
        attack: 0.01,
        decay: 0.05,
        sustain: 0.15,
        release: 0.3,
    },
    filter: {
        type  : "lowpass",
        frequency  : 750,
        rolloff  : -12 ,
        Q  : 2 ,
        gain  : 1
    },
    noteDuration: 0.1,
    octaveShift: [-2, -2, -2]  // [osc1, osc2, osc3]
};
