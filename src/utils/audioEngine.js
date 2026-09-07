// File: src/utils/audioEngine.js

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.synthInterval = null;
    this.isSynthActive = false;
    this.currentTrack = null;
    this.synthStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(volume) {
    if (this.masterGain && this.ctx) {
      const safeVol = Math.max(0, Math.min(1, volume)) * 0.25;
      this.masterGain.gain.setValueAtTime(safeVol, this.ctx.currentTime);
    }
  }

  // Play an instant pleasant confirmation chime on user click to ensure audio is working
  playChime() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      } catch {
        // Safe catch for autoplay restrictions
      }
    });
  }

  // Audio feedback & Web Audio API context helper
  startMelodicSynth() {
    // Disabled: User requested real songs with authentic audio only, no synthetic melodies
    this.stopMelodicSynth();
  }

  stopMelodicSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthActive = false;
  }
}

export const audioEngine = new AudioEngine();
