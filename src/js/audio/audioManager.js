// Audio Manager
class AudioManager {
    constructor() {
        this.ambientSynth = null;
        this.chimeSynth = null;
        this.clickSynth = null;
        this.soundOn = true;
    }

    init() {
        // Create a limiter for safe audio levels
        const limiter = new Tone.Limiter(-6).toDestination();
        
        // Ambient Hum/Drone with reverb
        const reverb = new Tone.Reverb({
            decay: 5,
            wet: 0.3
        }).connect(limiter);
        
        this.ambientSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: {
                attack: 2,
                decay: 0.5,
                sustain: 0.8,
                release: 3
            },
            volume: -20
        }).connect(reverb);

        // Chime for mouse over
        this.chimeSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.0,
                release: 0.2
            },
            volume: -15
        }).toDestination();

        // Click sound
        this.clickSynth = new Tone.Synth({
            oscillator: { type: "square" },
            envelope: {
                attack: 0.005,
                decay: 0.05,
                sustain: 0.0,
                release: 0.1
            },
            volume: -10
        }).toDestination();

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.body.addEventListener('click', () => {
            if (Tone.context.state !== 'running') {
                Tone.start();
                if (this.soundOn) {
                    this.playAmbientSound();
                }
            }
        }, { once: true });
    }

    playAmbientSound() {
        if (this.soundOn && this.ambientSynth) {
            this.ambientSynth.triggerAttackRelease(["C2", "G2", "C3"], "100");
        }
    }

    playChimeSound() {
        if (this.soundOn && Tone.context.state === 'running' && this.chimeSynth) {
            this.chimeSynth.triggerAttackRelease("C6", "8n");
        }
    }

    playClickSound() {
        if (this.soundOn && Tone.context.state === 'running' && this.clickSynth) {
            this.clickSynth.triggerAttackRelease("C4", "16n");
        }
    }

    toggleSound() {
        this.soundOn = !this.soundOn;
        if (this.soundOn) {
            if (Tone.context.state === 'running') {
                this.playAmbientSound();
            } else {
                Tone.start();
                this.playAmbientSound();
            }
        } else if (this.ambientSynth) {
            this.ambientSynth.releaseAll();
        }
        return this.soundOn;
    }
}

export const audioManager = new AudioManager();
