/* ===========================================================
   SSFB — background music + mute control
   Plays the festival theme track on load (where the browser
   allows) and falls back to starting on first interaction,
   since autoplay-with-sound is blocked until then.
   =========================================================== */

(() => {
  const TRACK_SRC = 'ATA-KAK-Unacceptable%20Color.mp3';

  const audio = new Audio(TRACK_SRC);
  audio.loop = true;
  audio.volume = 0.5;

  let userMuted = false;
  let suppressed = false; // true while sidebar is open

  function tryPlay() {
    if (userMuted || suppressed) return;
    audio.play().catch(() => {});
  }

  tryPlay();
  ['pointerdown', 'keydown', 'touchstart', 'mousemove'].forEach(ev => {
    document.addEventListener(ev, tryPlay, { once: true });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('muteBtn');
    if (!muteBtn) return;

    muteBtn.addEventListener('click', () => {
      userMuted = !userMuted;
      audio.muted = userMuted;
      muteBtn.classList.toggle('muted', userMuted);
      muteBtn.setAttribute('aria-pressed', String(userMuted));
      if (!userMuted) tryPlay();
    });
  });

  // Exposed so the landing page can pause the track while the sidebar
  // is open, and resume it once the sidebar closes.
  window.BGAudio = {
    suspend(){
      suppressed = true;
      audio.pause();
    },
    resume(){
      suppressed = false;
      tryPlay();
    }
  };
})();