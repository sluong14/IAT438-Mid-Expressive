/* ===========================================================
   SSFB — landing page interactions
   =========================================================== */

(() => {
  const fieldWrap = document.getElementById('fieldWrap');
  const barField  = document.getElementById('barField');
  const swipeLine = document.getElementById('swipeLine');
  const swipeHint = document.getElementById('swipeHint');
  const tooltip   = document.getElementById('tooltip');
  const logoMark  = document.querySelector('.logo-watermark');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const backBtn   = document.getElementById('backBtn');
  const exploreBtn= document.getElementById('exploreBtn');
  const artistRows= document.getElementById('artistRows');
  const nowBadge  = document.getElementById('nowBadge');
  const nowText   = document.getElementById('nowText');
  const miniBars  = document.getElementById('miniBars');

  // mini flicker bars for "explore similar sounds"
  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span');
    const h = 6 + Math.random() * 16;
    span.style.height = h + 'px';
    span.style.animationDelay = (Math.random() * 1.1).toFixed(2) + 's';
    miniBars.appendChild(span);
  }

  /* ---------- imported Figma bar field (SVG) ---------- */
  // background.svg was exported from the Figma "soundfield" group — every
  // <path class="svgbar" data-cx="..."> is one bar, with data-cx giving its
  // horizontal center in the SVG's 1728-wide viewBox.
  const VIEW_W = 1728;
  const SWIPE_RADIUS_VIEW = 70; // px in viewBox units
  const BIN_WIDTH = 80;
  const NUM_BINS = Math.ceil(VIEW_W / BIN_WIDTH) + 1;

  const svgBars = Array.from(barField.querySelectorAll('.svgbar'));
  const bins = Array.from({ length: NUM_BINS }, () => []);

  svgBars.forEach(bar => {
    const cx = parseFloat(bar.dataset.cx);
    const bin = Math.floor(cx / BIN_WIDTH);
    if (bins[bin]) bins[bin].push({ el: bar, cx });

    // tag bars that fall inside a genre cluster's x-range
    const t = cx / VIEW_W;
    const cluster = FESTIVAL_DATA.clusters.find(c => t >= c.barRange[0] && t <= c.barRange[1]);
    if (cluster) bar.dataset.cluster = cluster.id;
  });

  let activeBars = new Set();
  let activeCluster = null;

  /* ---------- fake track-duration scrub bar ---------- */
  const TRACK_DURATION = 180; // seconds, looping
  let progressTimer = null;
  let elapsed = 0;

  function startProgress() {
    elapsed = 0;
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      elapsed = (elapsed + 0.25) % TRACK_DURATION;
      const pct = (elapsed / TRACK_DURATION) * 100;
      const fill = document.getElementById('rdbFill');
      const dot  = document.getElementById('rdbDot');
      if (fill) fill.style.width = pct + '%';
      if (dot)  dot.style.left = pct + '%';
    }, 250);
  }

  function stopProgress() {
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = null;
  }

  /* ---------- swipe highlight ---------- */

  fieldWrap.addEventListener('mousemove', (e) => {
    const rect = fieldWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    swipeLine.style.left = x + 'px';
    swipeHint.style.left = x + 'px';
    swipeHint.style.top  = y + 'px';
    swipeHint.classList.add('show');

    // convert screen px -> SVG viewBox units
    const vx = (x / rect.width) * VIEW_W;
    const binIndex = Math.floor(vx / BIN_WIDTH);

    const next = new Set();
    for (let b = binIndex - 1; b <= binIndex + 1; b++) {
      const bucket = bins[b];
      if (!bucket) continue;
      bucket.forEach(({ el, cx }) => {
        if (Math.abs(cx - vx) < SWIPE_RADIUS_VIEW) next.add(el);
      });
    }

    activeBars.forEach(el => { if (!next.has(el)) el.classList.remove('swipe-near'); });
    next.forEach(el => el.classList.add('swipe-near'));
    activeBars = next;

    // tooltip / cluster hover detection
    const t = x / rect.width;
    const cluster = FESTIVAL_DATA.clusters.find(c => t >= c.barRange[0] && t <= c.barRange[1]);

    if (cluster) {
      tooltip.classList.add('show');
      document.getElementById('ttGenre').textContent = cluster.genre;
      document.getElementById('ttStage').textContent = cluster.stage;
      document.getElementById('ttGenreLabel').textContent = cluster.genreLabel;
      document.getElementById('ttNext').textContent = cluster.nextSet;

      // position tooltip near cursor, keep on-screen
      let left = x + 24;
      let top  = y + 24;
      const ttWidth = 240;
      if (left + ttWidth > rect.width) left = x - ttWidth - 24;
      tooltip.style.left = left + 'px';
      tooltip.style.top  = top + 'px';

      fieldWrap.style.cursor = 'pointer';
      activeCluster = cluster;
      swipeHint.classList.remove('show');
    } else {
      tooltip.classList.remove('show');
      fieldWrap.style.cursor = 'default';
      activeCluster = null;
      swipeHint.classList.add('show');
    }
  });

  fieldWrap.addEventListener('mouseleave', () => {
    activeBars.forEach(el => el.classList.remove('swipe-near'));
    activeBars = new Set();
    tooltip.classList.remove('show');
    swipeHint.classList.remove('show');
    activeCluster = null;
  });

  /* ---------- click cluster -> open sidebar ---------- */
  fieldWrap.addEventListener('click', () => {
    if (activeCluster) openSidebar(activeCluster);
  });

  function openSidebar(cluster) {
    document.getElementById('sbGenre').textContent = cluster.genre;
    document.getElementById('sbCount').textContent =
      `[ 0${cluster.artists.length} ARTISTS TODAY ]`;

    artistRows.innerHTML = '';
    cluster.artists.forEach(artist => {
      const tr = document.createElement('tr');
      tr._artist = artist;
      tr.innerHTML = renderRowContent(artist);

      tr.addEventListener('click', () => toggleArtist(tr, artist, cluster));
      artistRows.appendChild(tr);
    });

    sidebar.classList.add('open');
    overlay.classList.add('show');
    tooltip.classList.remove('show');
    logoMark.classList.add('dimmed');
  }

  function renderRowContent(artist) {
    return `
        <td>
          <span class="artist-name">
            <span class="play-btn"></span>
            ${artist.name}
          </span>
        </td>
        <td class="stage-cell">${artist.stage}</td>
        <td>${artist.time}</td>
      `;
  }

  function renderDurationRow() {
    return `
        <td colspan="3">
          <div class="row-duration-bar">
            <span class="rdb-handle"></span>
            <div class="rdb-track">
              <div class="rdb-fill" id="rdbFill"></div>
              <span class="rdb-dot" id="rdbDot"></span>
            </div>
          </div>
        </td>
      `;
  }

  function toggleArtist(tr, artist, cluster) {
    const wasPlaying = tr.classList.contains('playing');

    // restore any other playing row back to normal
    artistRows.querySelectorAll('tr.playing').forEach(row => {
      row.classList.remove('playing', 'playing-row');
      row.innerHTML = renderRowContent(row._artist);
    });

    if (wasPlaying) {
      SoundEngine.stop();
      nowBadge.classList.remove('show');
      stopProgress();
      return;
    }

    tr.classList.add('playing', 'playing-row');
    tr.innerHTML = renderDurationRow();

    SoundEngine.play(artist.freq);
    nowText.textContent = `NOW PLAYING — ${artist.name}`;
    nowBadge.classList.add('show');
    startProgress();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    logoMark.classList.remove('dimmed');
  }

  backBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  exploreBtn.addEventListener('click', () => {
    window.location.href = 'like.html';
  });

})();