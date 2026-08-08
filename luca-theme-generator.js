/**
 * Luca's Theme — Full Song Generator
 * Generates a complete song with vocals + instruments
 * Uses VocalSynthesizer for singing + AudioSynthesizer for backing
 */

class LucaThemeGenerator {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.vocalSynth = new VocalSynthesizer(this.ctx);
        this.sampleRate = this.ctx.sampleRate;
    }

    /**
     * Generate the complete song
     * @returns {AudioBuffer} - Mixed stereo audio buffer
     */
    async generate() {
        const tempo = 140; // BPM
        const beatDuration = 60 / tempo;

        // Define the melody (MIDI notes + durations in beats)
        const melody = this.getMelody(beatDuration);
        
        // Define the lyrics (mapped to melody sections)
        const lyrics = this.getLyrics();
        
        // Generate vocal track
        console.log('🎤 Generating vocals...');
        const vocalBuffer = await this.vocalSynth.synthesize(lyrics.full, melody, {
            gender: 'male',
            vibrato: 0.4,
            breathiness: 0.15,
            gain: 0.8
        });

        // Generate backing tracks
        console.log('🎸 Generating instruments...');
        const backingBuffer = await this.generateBacking(melody, beatDuration);

        // Mix vocals + backing
        console.log('🎛️ Mixing...');
        const mixed = this.mixTracks([vocalBuffer, backingBuffer], [0.85, 0.6]);

        return mixed;
    }

    getMelody(beatDuration) {
        // Complete melody — Luca's Theme in G major
        // Format: {note: MIDI, duration: seconds}
        const notes = [
            // Intro (4 beats)
            {note: 67, duration: beatDuration * 2},  // G4
            {note: 71, duration: beatDuration * 2},  // B4

            // Verse 1 - "Born with a spark, a fire in my eye"
            {note: 67, duration: beatDuration},      // G4 "Born"
            {note: 69, duration: beatDuration * 0.5}, // A4 "with"
            {note: 71, duration: beatDuration * 0.5}, // B4 "a"
            {note: 72, duration: beatDuration},       // C5 "spark"
            {note: 74, duration: beatDuration * 2},   // D5 "a fire"
            {note: 72, duration: beatDuration},       // C5 "in"
            {note: 71, duration: beatDuration * 2},   // B4 "my eye"

            // "Every gym, every badge, every trial I face"
            {note: 67, duration: beatDuration},       // G4 "Ev-"
            {note: 69, duration: beatDuration * 0.5}, // A4 "-ry"
            {note: 71, duration: beatDuration * 0.5}, // B4 "gym"
            {note: 69, duration: beatDuration},       // A4 "ev-"
            {note: 67, duration: beatDuration},       // G4 "-ry"
            {note: 66, duration: beatDuration},       // F#4 "badge"
            {note: 67, duration: beatDuration * 2},   // G4 "ev-ry"
            {note: 64, duration: beatDuration},       // E4 "tri-"
            {note: 66, duration: beatDuration * 2},   // F#4 "al I face"

            // "Luca's on a mission, gonna win the race"
            {note: 67, duration: beatDuration},       // G4 "Lu-"
            {note: 69, duration: beatDuration * 0.5}, // A4 "-ca's"
            {note: 71, duration: beatDuration * 0.5}, // B4 "on"
            {note: 72, duration: beatDuration},       // C5 "a"
            {note: 74, duration: beatDuration * 2},   // D5 "mis-"
            {note: 72, duration: beatDuration},       // C5 "-sion"
            {note: 71, duration: beatDuration * 2},   // B4 "gon-na"
            {note: 74, duration: beatDuration * 2},   // D5 "win"
            {note: 72, duration: beatDuration * 2},   // C5 "the race"

            // CHORUS - "Gotta catch 'em all, Luca's the name"
            {note: 79, duration: beatDuration * 2},   // G5 "Got-ta"
            {note: 77, duration: beatDuration},       // F#5 "catch"
            {note: 76, duration: beatDuration * 2},   // E5 "'em"
            {note: 74, duration: beatDuration * 2},   // D5 "all"
            {note: 72, duration: beatDuration},       // C5 "Lu-"
            {note: 71, duration: beatDuration},       // B4 "-ca's"
            {note: 69, duration: beatDuration * 2},   // A4 "the"
            {note: 67, duration: beatDuration * 2},   // G4 "name"

            // "Pokémon Master, that's my claim to fame"
            {note: 72, duration: beatDuration},       // C5 "Po-ké-"
            {note: 74, duration: beatDuration},       // D5 "-mon"
            {note: 76, duration: beatDuration * 2},   // E5 "Mas-"
            {note: 74, duration: beatDuration * 2},   // D5 "-ter"
            {note: 72, duration: beatDuration},       // C5 "that's"
            {note: 71, duration: beatDuration},       // B4 "my"
            {note: 69, duration: beatDuration * 2},   // A4 "claim"
            {note: 67, duration: beatDuration * 2},   // G4 "to fame"

            // "Thunderbolt and fire, water, grass, and ground"
            {note: 79, duration: beatDuration * 2},   // G5 "Thun-der-"
            {note: 77, duration: beatDuration},       // F#5 "-bolt"
            {note: 76, duration: beatDuration * 2},   // E5 "and"
            {note: 74, duration: beatDuration * 2},   // D5 "fire"
            {note: 72, duration: beatDuration},       // C5 "wa-"
            {note: 71, duration: beatDuration},       // B4 "-ter"
            {note: 69, duration: beatDuration},       // A4 "grass"
            {note: 67, duration: beatDuration},       // G4 "and"
            {note: 66, duration: beatDuration * 2},   // F#4 "ground"

            // "Luca's gonna battle 'til the best is found"
            {note: 67, duration: beatDuration},       // G4 "Lu-"
            {note: 69, duration: beatDuration},       // A4 "-ca's"
            {note: 71, duration: beatDuration * 2},   // B4 "gon-na"
            {note: 72, duration: beatDuration * 2},   // C5 "bat-"
            {note: 74, duration: beatDuration},       // D5 "-tle"
            {note: 76, duration: beatDuration},       // E5 "'til"
            {note: 74, duration: beatDuration * 2},   // D5 "the"
            {note: 72, duration: beatDuration * 2},   // C5 "best"
            {note: 71, duration: beatDuration * 2},   // B4 "is found"

            // Bridge - "From Kanto to Johto, Hoenn to Sinnoh"
            {note: 74, duration: beatDuration * 2},   // D5 "From"
            {note: 72, duration: beatDuration},       // C5 "Kan-"
            {note: 71, duration: beatDuration},       // B4 "-to"
            {note: 69, duration: beatDuration * 2},   // A4 "to"
            {note: 67, duration: beatDuration * 2},   // G4 "Jo-"
            {note: 66, duration: beatDuration * 2},   // F#4 "-ho"
            {note: 64, duration: beatDuration * 2},   // E4 "Ho-"
            {note: 66, duration: beatDuration},       // F#4 "-enn"
            {note: 67, duration: beatDuration * 2},   // G4 "to"
            {note: 69, duration: beatDuration * 2},   // A4 "Si-nnoh"

            // "Every region knows me, every legend knows"
            {note: 71, duration: beatDuration * 2},   // B4 "Ev-ry"
            {note: 72, duration: beatDuration},       // C5 "re-"
            {note: 74, duration: beatDuration},       // D5 "-gion"
            {note: 76, duration: beatDuration * 2},   // E5 "knows"
            {note: 74, duration: beatDuration * 2},   // D5 "me"
            {note: 72, duration: beatDuration},       // C5 "ev-"
            {note: 71, duration: beatDuration},       // B4 "-ry"
            {note: 69, duration: beatDuration * 2},   // A4 "le-"
            {note: 67, duration: beatDuration * 2},   // G4 "-gend knows"

            // Final Chorus
            {note: 79, duration: beatDuration * 2},   // G5 "Got-ta"
            {note: 77, duration: beatDuration},       // F#5 "catch"
            {note: 76, duration: beatDuration * 2},   // E5 "'em"
            {note: 74, duration: beatDuration * 2},   // D5 "all"
            {note: 72, duration: beatDuration},       // C5 "Lu-"
            {note: 71, duration: beatDuration},       // B4 "-ca's"
            {note: 69, duration: beatDuration * 2},   // A4 "the"
            {note: 67, duration: beatDuration * 2},   // G4 "name"

            // Outro
            {note: 67, duration: beatDuration * 4},   // G4 "Lu-ca..."
            {note: 71, duration: beatDuration * 4},   // B4 "Lu-ca..."
            {note: 79, duration: beatDuration * 8},   // G5 "Pokémon Master!"
        ];

        return notes;
    }

    getLyrics() {
        return {
            verse1: "Born with a spark a fire in my eye Every gym every badge every trial I face Lucas on a mission gonna win the race",
            chorus: "Gotta catch em all Lucas the name Pokemon Masters thats my claim to fame Thunderbolt and fire water grass and ground Lucas gonna battle til the best is found",
            bridge: "From Kanto to Johto Hoenn to Sinnoh Every region knows me every legend knows",
            outro: "Luca Luca Pokemon Master",
            full: "Born with a spark a fire in my eye Every gym every badge every trial I face Lucas on a mission gonna win the race Gotta catch em all Lucas the name Pokemon Masters thats my claim to fame Thunderbolt and fire water grass and ground Lucas gonna battle til the best is found From Kanto to Johto Hoenn to Sinnoh Every region knows me every legend knows Gotta catch em all Lucas the name Pokemon Masters thats my claim to fame Luca Luca Pokemon Master"
        };
    }

    /**
     * Generate backing instruments (bass + chords + drums)
     */
    async generateBacking(melody, beatDuration) {
        const totalDuration = melody.reduce((sum, n) => sum + n.duration, 0);
        const numSamples = Math.ceil(totalDuration * this.sampleRate);
        const buffer = this.ctx.createBuffer(2, numSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);

        // Chord progression: G - D - Em - C (repeating)
        const chordProg = [
            [55, 59, 62],   // G3 chord
            [50, 54, 57],   // D3 chord
            [52, 55, 59],   // Em chord
            [48, 52, 55],   // C3 chord
        ];

        let currentSample = 0;
        let chordIdx = 0;
        const chordDuration = beatDuration * 4; // 4 beats per chord

        for (const note of melody) {
            const noteSamples = Math.floor(note.duration * this.sampleRate);
            
            for (let i = 0; i < noteSamples; i++) {
                const t = i / this.sampleRate;
                const globalT = (currentSample + i) / this.sampleRate;
                
                // Determine current chord
                const chordSample = Math.floor(globalT / chordDuration) % chordProg.length;
                const chordNotes = chordProg[chordSample];
                
                let sample = 0;
                
                // Pad synth (chords)
                for (const chordNote of chordNotes) {
                    const freq = this.midiToFreq(chordNote);
                    const env = Math.exp(-t * 2) * 0.3;
                    sample += (Math.sin(2 * Math.PI * freq * t) * env) * 0.15;
                }
                
                // Bass
                const bassNote = chordNotes[0]; // root note
                const bassFreq = this.midiToFreq(bassNote - 12); // one octave down
                const bassEnv = Math.exp(-t * 3) * 0.4;
                sample += Math.sin(2 * Math.PI * bassFreq * t) * bassEnv * 0.25;
                
                // Kick drum (on beat 1)
                const beatPos = (globalT % beatDuration) / beatDuration;
                if (beatPos < 0.05) {
                    const kickFreq = 150 * Math.exp(-t * 30);
                    sample += Math.sin(2 * Math.PI * kickFreq * t) * 0.3;
                }
                
                // Hi-hat (every half beat)
                const halfBeatPos = (globalT % (beatDuration / 2)) / (beatDuration / 2);
                if (halfBeatPos < 0.02) {
                    sample += (Math.random() * 2 - 1) * 0.08;
                }

                const idx = currentSample + i;
                if (idx < numSamples) {
                    left[idx] += sample;
                    right[idx] += sample * 0.95; // slight stereo
                }
            }
            
            currentSample += noteSamples;
        }

        return buffer;
    }

    /**
     * Mix multiple audio buffers
     */
    mixTracks(buffers, gains) {
        let maxLength = 0;
        for (const buf of buffers) {
            maxLength = Math.max(maxLength, buf.length);
        }

        const mixed = this.ctx.createBuffer(2, maxLength, this.sampleRate);
        const left = mixed.getChannelData(0);
        const right = mixed.getChannelData(1);

        for (let b = 0; b < buffers.length; b++) {
            const buf = buffers[b];
            const gain = gains[b];
            const bufLeft = buf.getChannelData(0);
            const bufRight = buf.getChannelData(1);

            for (let i = 0; i < buf.length; i++) {
                left[i] += bufLeft[i] * gain;
                right[i] += (bufRight[i] || bufLeft[i]) * gain;
            }
        }

        // Normalize
        let maxVal = 0;
        for (let i = 0; i < maxLength; i++) {
            maxVal = Math.max(maxVal, Math.abs(left[i]), Math.abs(right[i]));
        }
        if (maxVal > 0.95) {
            const norm = 0.95 / maxVal;
            for (let i = 0; i < maxLength; i++) {
                left[i] *= norm;
                right[i] *= norm;
            }
        }

        return mixed;
    }

    midiToFreq(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    /**
     * Export AudioBuffer to WAV blob
     */
    exportWAV(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;

        const left = buffer.getChannelData(0);
        const right = numChannels > 1 ? buffer.getChannelData(1) : left;
        const numSamples = left.length;

        const dataSize = numSamples * blockAlign;
        const headerSize = 44;
        const totalSize = headerSize + dataSize;

        const arrayBuffer = new ArrayBuffer(totalSize);
        const view = new DataView(arrayBuffer);

        // WAV header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, totalSize - 8, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);

        // Write samples
        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            const leftSample = Math.max(-1, Math.min(1, left[i]));
            const rightSample = Math.max(-1, Math.min(1, right[i]));
            
            view.setInt16(offset, leftSample * 0x7FFF, true);
            offset += 2;
            view.setInt16(offset, rightSample * 0x7FFF, true);
            offset += 2;
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}

// Export
window.LucaThemeGenerator = LucaThemeGenerator;
