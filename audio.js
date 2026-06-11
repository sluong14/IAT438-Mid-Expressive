/* ===========================================================
   SSFB — tiny generative audio engine (Web Audio API)
   Synthesizes a soft ambient drone per artist "freq" so clicking
   an artist plays something without needing audio files.
   =========================================================== */

const SoundEngine = (() => {
  let ctx = null;
  let current = null; // { osc1, osc2, gain, lfo }

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function stop() {
    if (!current) return;
    const { osc1, osc2, gain, lfo } = current;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); lfo.stop(); } catch (e) {}
    }, 450);
    current = null;
  }

  function play(freq) {
    stop();
    const c = ensureCtx();
    const now = c.currentTime;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.6);

    const osc1 = c.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq;

    const osc2 = c.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 1.5;

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    // slow LFO modulating filter for movement
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);

    osc1.start();
    osc2.start();
    lfo.start();

    current = { osc1, osc2, gain, lfo };
  }

  function isPlaying() { return !!current; }

  return { play, stop, isPlaying };
})();