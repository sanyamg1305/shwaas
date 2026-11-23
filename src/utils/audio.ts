// Web Audio API chime generator for breathing & inhaler timer cues
class AudioChime {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft gentle bell chime for breathing phase transition
  playTone(frequency: number = 440, duration: number = 0.5, type: OscillatorType = 'sine') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser policy before user interaction
    }
  }

  // Two-tone chime for completion
  playSuccessChime() {
    this.playTone(523.25, 0.25); // C5
    setTimeout(() => {
      this.playTone(659.25, 0.4); // E5
    }, 200);
  }

  // Inhale cue (rising gentle tone)
  playInhale() {
    this.playTone(440, 0.4); // A4
  }

  // Exhale cue (softer grounding tone)
  playExhale() {
    this.playTone(330, 0.4); // E4
  }

  // Hold cue (subtle gentle ping)
  playHold() {
    this.playTone(493.88, 0.2); // B4
  }
}

export const soundFx = new AudioChime();
