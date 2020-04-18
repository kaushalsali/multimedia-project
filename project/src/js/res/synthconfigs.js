const SYNTH_CONFIGS = {"Mid": {}, "Low": {} };


SYNTH_CONFIGS["Mid"] = {
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
        frequency  : 500,
        rolloff  : -12 ,
        Q  : 1 ,
        gain  : 0
    },
    lfo: {
        config: {
            type: "sine",
            frequency: 10,
            min: -5,
            max: 5,
            amplitude: 1
        },
    },
    noteDuration: 0.3,
    octaveShift: 0
};




SYNTH_CONFIGS["Low"] = {
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
    lfo: {
        config: {
            type: "sine",
            frequency: "4n",
            min: 0,
            max: 1,
            amplitude: 1
        },
        connectTo: null  // Initialize after defining this object.
    },
    noteDuration: 0.3,
    octaveShift: 0
};
// SYNTH_CONFIGS["Low"].lfo.connectTo = SYNTH_CONFIGS["Low"].filter.frequency;  // LFO Connection



