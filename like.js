/* ===========================================================
   SSFB — "you might also like" page interactions
   =========================================================== */

(() => {
  const BAR_COUNT = 90;
  const SWIPE_RADIUS = 36;
  const HIGHLIGHT_SPAN = 0.025; // fraction of width either side of barPos counted as "on" the highlight

  const fieldWrap   = document.getElementById('fieldWrap');
  const barField    = document.getElementById('barField');
  const swipeLine   = document.getElementById('swipeLine');
  const swipeHint   = document.getElementById('swipeHint');
  const revealLayer = document.getElementById('revealLayer');
  const nowBadge    = document.getElementById('nowBadge');
  const nowText     = document.getElementById('nowText');

  /* ---------- build bar field ---------- */
  const bars = [];

  function heightForIndex(i, n) {
    const t = i / n;
    let h = 0.45
      + 0.30 * Math.sin(t * Math.PI * 3.2 + 0.6)
      + 0.14 * Math.sin(t * Math.PI * 9.0 + 1.4)
      + (Math.random() - 0.5) * 0.18;
    return Math.min(0.95, Math.max(0.08, h));
  }

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = (heightForIndex(i, BAR_COUNT) * 100) + '%';

    const t = i / BAR_COUNT;
    const rec = FESTIVAL_DATA.recommended.find(r => Math.abs(t - r.barPos) < HIGHLIGHT_SPAN);
    if (rec) {
      bar.classList.add('like-highlight');
      bar.dataset.artist = rec.name;
    }

    barField.appendChild(bar);
    bars.push(bar);
  }

  /* ---------- build reveal cards ---------- */
  const cards = FESTIVAL_DATA.recommended.map(rec => {
    const card = document.createElement('div');
    card.className = 'reveal-card';
    const coverBg = rec.cover ? `url('${rec.cover}')` : rec.coverGradient;
    card.innerHTML = `
      <div class="cover" style="background-image:${coverBg}"></div>
      <div class="info">
        <div class="genre">${rec.genre}</div>
        <div class="name">${rec.name}</div>
        <div class="meta-row"><span>STAGE</span><span>${rec.stage}</span></div>
        <div class="meta-row"><span>TIME</span><span>${rec.time}</span></div>
      </div>
      <span class="corner tl"></span>
      <span class="corner br"></span>
    `;
    revealLayer.appendChild(card);

    // position card centered on its bar position, cover overlapping the soundwave
    const leftPct = rec.barPos * 100;
    card.style.left = `calc(${leftPct}% - 100px)`;
    card.style.top = 'calc(50% - 90px)';

    return { rec, card, active: false };
  });

  /* ---------- swipe interactions ---------- */
  fieldWrap.addEventListener('mousemove', (e) => {
    const rect = fieldWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;

    swipeLine.style.left = x + 'px';
    swipeHint.style.left = x + 'px';
    swipeHint.style.top = (e.clientY - rect.top) + 'px';
    swipeHint.classList.add('show');

    bars.forEach(bar => {
      const bRect = bar.getBoundingClientRect();
      const bx = bRect.left + bRect.width / 2 - rect.left;
      const dist = Math.abs(bx - x);
      bar.classList.toggle('swipe-near', dist < SWIPE_RADIUS);
    });

    const t = x / rect.width;
    cards.forEach(({ rec, card }) => {
      const onIt = Math.abs(t - rec.barPos) < HIGHLIGHT_SPAN + 0.012;
      card.classList.toggle('show', onIt);

      if (onIt && !card.dataset.playing) {
        card.dataset.playing = '1';
        SoundEngine.play(rec.freq);
        nowText.textContent = `NOW PLAYING — ${rec.name}`;
        nowBadge.classList.add('show');
      } else if (!onIt && card.dataset.playing) {
        delete card.dataset.playing;
      }
    });

    // stop sound if cursor not over any highlighted artist
    const overAny = cards.some(({ rec }) => Math.abs(t - rec.barPos) < HIGHLIGHT_SPAN + 0.012);
    if (!overAny && SoundEngine.isPlaying()) {
      SoundEngine.stop();
      nowBadge.classList.remove('show');
    }
  });

  fieldWrap.addEventListener('mouseleave', () => {
    bars.forEach(bar => bar.classList.remove('swipe-near'));
    cards.forEach(({ card }) => { card.classList.remove('show'); delete card.dataset.playing; });
    swipeHint.classList.remove('show');
    SoundEngine.stop();
    nowBadge.classList.remove('show');
  });

})();