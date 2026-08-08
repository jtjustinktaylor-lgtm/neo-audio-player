/**
 * Vocal Synthesizer — Singing voice synthesis using Web Audio API
 * Creates formant-based vocal sounds that follow a melody + lyrics
 */

class VocalSynthesizer {
    constructor(audioContext) {
        this.ctx = audioContext;
        
        // Formant frequencies for different vowels (male voice)
        this.vowels = {
            'AH': [730, 1090, 2440],   // "ah" as in "father"
            'AE': [660, 1700, 2400],   // "a" as in "cat"
            'EH': [530, 1840, 2480],   // "e" as in "bed"
            'IH': [390, 1990, 2550],   // "i" as in "bit"
            'OH': [570, 840, 2410],    // "o" as in "go"
            'UH': [300, 870, 2240],    // "u" as in "put"
            'OO': [350, 900, 2200],    // "oo" as in "food"
            'EE': [270, 2290, 3010],   // "ee" as in "see"
            'AW': [590, 880, 2540],    // "aw" as in "saw"
            'AY': [660, 1700, 2400],   // "ay" as in "say"
            'ER': [490, 1350, 1690],   // "er" as in "her"
            'IH': [390, 1990, 2550],   // "ih" as in "sit"
        };

        // Phoneme to vowel mapping
        this.phonemeMap = {
            'AA': 'AH', 'AE': 'AE', 'AH': 'AH', 'AO': 'AW',
            'AW': 'AW', 'AY': 'AY', 'B': 'UH', 'CH': 'IH',
            'D': 'EH', 'DH': 'AE', 'EH': 'EH', 'ER': 'ER',
            'EY': 'AY', 'F': 'UH', 'G': 'AH', 'HH': 'AH',
            'IH': 'IH', 'IY': 'EE', 'JH': 'IH', 'K': 'AH',
            'L': 'UH', 'M': 'UH', 'N': 'AH', 'NG': 'AH',
            'OW': 'OH', 'OY': 'OH', 'P': 'UH', 'R': 'ER',
            'S': 'IH', 'SH': 'IH', 'T': 'EH', 'TH': 'AE',
            'UH': 'UH', 'UW': 'OO', 'V': 'AE', 'W': 'OO',
            'Y': 'EE', 'Z': 'IH', 'ZH': 'IH'
        };
    }

    /**
     * Convert lyrics text to phonemes
     */
    textToPhonemes(text) {
        const words = text.toUpperCase().split(/\s+/);
        const phonemes = [];
        
        for (const word of words) {
            const chars = word.split('');
            for (let i = 0; i < chars.length; i++) {
                const c = chars[i];
                const next = chars[i + 1];
                const prev = chars[i - 1];
                
                // Simple letter-to-phoneme rules
                if ('AEIOU'.includes(c)) {
                    // Vowels
                    phonemes.push(this.getVowelPhoneme(c, prev, next));
                } else if (c === ' ') {
                    phonemes.push('SILENCE');
                } else {
                    // Consonants — map to a vowel for formant shaping
                    phonemes.push(this.getConsonantPhoneme(c, next));
                }
            }
            phonemes.push('SILENCE'); // word boundary
        }
        
        return phonemes;
    }

    getVowelPhoneme(vowel, prev, next) {
        // Context-dependent vowel mapping
        switch(vowel) {
            case 'A':
                if (prev === ' ') return 'AE'; // start of word
                return 'AH';
            case 'E':
                if (next && 'AEIOU'.includes(next)) return 'EE';
                return 'EH';
            case 'I':
                if (next === 'E') return 'IH';
                return 'IH';
            case 'O':
                if (next === 'O') return 'OO';
                return 'OH';
            case 'U':
                if (next === 'E') return 'OO';
                return 'UH';
            default: return 'AH';
        }
    }

    getConsonantPhoneme(consonant, next) {
        // Map consonants to nearby vowels for resonance
        switch(consonant) {
            case 'B': case 'P': case 'M': return 'UH';
            case 'F': case 'V': return 'AE';
            case 'T': case 'D': case 'N': case 'L': return 'EH';
            case 'S': case 'Z': case 'SH': case 'ZH': return 'IH';
            case 'K': case 'G': case 'NG': return 'AH';
            case 'R': return 'ER';
            case 'W': return 'OO';
            case 'Y': return 'EE';
            case 'H': return 'AH';
            default: return 'UH';
        }
    }

    /**
     * Synthesize singing voice
     * @param {string} lyrics - The lyrics text
     * @param {Array} melody - Array of {note: midiNote, duration: seconds} objects
     * @param {object} options - Voice options
     * @returns {AudioBuffer} - The synthesized vocal audio
     */
    async synthesize(lyrics, melody, options = {}) {
        const {
            gender = 'male',    // 'male' or 'female'
            vibrato = 0.3,      // 0-1
            breathiness = 0.2,  // 0-1
            gain = 0.7
        } = options;

        const sampleRate = this.ctx.sampleRate;
        const phonemes = this.textToPhonemes(lyrics);
        
        // Calculate total duration from melody
        let totalDuration = 0;
        for (const note of melody) {
            totalDuration += note.duration;
        }
        
        // Create audio buffer
        const numSamples = Math.ceil(totalDuration * sampleRate);
        const buffer = this.ctx.createBuffer(2, numSamples, sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        // Synthesize each note
        let currentSample = 0;
        const phonemeDuration = totalDuration / Math.max(phonemes.length, 1);
        
        for (let noteIdx = 0; noteIdx < melody.length; noteIdx++) {
            const note = melody[noteIdx];
            const freq = this.midiToFreq(note.note);
            const noteSamples = Math.floor(note.duration * sampleRate);
            
            // Get phoneme for this note
            const phonemeIdx = Math.floor((currentSample / sampleRate) / phonemeDuration);
            const phoneme = phonemes[Math.min(phonemeIdx, phonemes.length - 1)] || 'AH';
            const vowel = this.phonemeMap[phoneme] || 'AH';
            const formants = this.vowels[vowel] || this.vowels['AH'];
            
            // Synthesize the note
            for (let i = 0; i < noteSamples; i++) {
                const t = i / sampleRate;
                const progress = i / noteSamples;
                
                // Base pitch with vibrato
                const vibratoAmount = vibrato * 3 * Math.sin(2 * Math.PI * 5.5 * t);
                const currentFreq = freq + vibratoAmount;
                
                // Generate glottal pulse (source signal)
                const glottal = this.glottalPulse(t, currentFreq);
                
                // Apply formant filtering (vocal tract)
                const formantSignal = this.applyFormants(glottal, formants, t);
                
                // Add breathiness
                const noise = (Math.random() * 2 - 1) * breathiness * 0.1;
                
                // ADSR envelope
                const envelope = this.vocalEnvelope(progress, note.duration);
                
                // Final sample
                let sample = (formantSignal + noise) * envelope * gain;
                
                // Soft clipping to prevent distortion
                sample = Math.tanh(sample * 1.5) * 0.8;
                
                const idx = currentSample + i;
                if (idx < numSamples) {
                    // Slight stereo spread
                    left[idx] += sample * 0.9;
                    right[idx] += sample * 0.9;
                }
            }
            
            currentSample += noteSamples;
        }
        
        return buffer;
    }

    /**
     * Generate a glottal pulse (the raw vocal cord vibration)
     */
    glottalPulse(t, frequency) {
        const phase = (t * frequency) % 1;
        
        // Rosenberg glottal pulse model
        if (phase < 0.4) {
            // Opening phase
            const x = phase / 0.4;
            return 3 * x * x - 2 * x * x * x;
        } else if (phase < 0.6) {
            // Closing phase
            const x = (phase - 0.4) / 0.2;
            return 1 - x * x;
        } else {
            // Closed phase
            return 0;
        }
    }

    /**
     * Apply formant filters (vocal tract resonance)
     */
    applyFormants(signal, formants, t) {
        let result = 0;
        
        // Apply each formant as a resonant filter
        for (let i = 0; i < formants.length; i++) {
            const freq = formants[i];
            const bandwidth = freq * 0.1; // bandwidth proportional to frequency
            const resonance = Math.exp(-bandwidth * t) * Math.sin(2 * Math.PI * freq * t);
            result += signal * resonance * (0.6 / (i + 1)); // decreasing amplitude for higher formants
        }
        
        return result;
    }

    /**
     * Vocal-specific ADSR envelope
     */
    vocalEnvelope(progress, duration) {
        const attack = 0.05;  // quick attack
        const release = 0.1;  // short release
        
        if (progress < attack) {
            return progress / attack;
        } else if (progress > 1 - release) {
            return (1 - progress) / release;
        }
        return 1;
    }

    /**
     * MIDI note to frequency
     */
    midiToFreq(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    /**
     * Generate a complete vocal track from lyrics and melody data
     */
    async generateVocalTrack(songData, options = {}) {
        const { lyrics, melody, tempo = 120 } = songData;
        
        // Convert melody to note array with durations in seconds
        const noteArray = melody.map(n => ({
            note: n.pitch || n.note,
            duration: (n.duration / tempo) * 60 // convert beats to seconds
        }));
        
        return await this.synthesize(lyrics, noteArray, options);
    }
}

// Export for use
window.VocalSynthesizer = VocalSynthesizer;
