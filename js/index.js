/* ── CURSOR ── */
const dot = document.getElementById('curDot'), ring = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' });
(function animRing() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing) })();

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', scrollY > 60) }, { passive: true });

/* ── MOBILE MENU ── */
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open') }

/* ── METEORS ── */
(function () {
  const layer = document.getElementById('meteorLayer');
  for (let i = 0; i < 24; i++) {
    const m = document.createElement('div');
    m.className = 'meteor';
    const left = 10 + Math.random() * 100, top = Math.random() * 80;
    const dur = 2.5 + Math.random() * 4, delay = Math.random() * 10, len = 50 + Math.random() * 80;
    m.style.cssText = `left:${left}%;top:${top}%;height:${len}px;animation-duration:${dur}s;animation-delay:${delay}s`;
    layer.appendChild(m);
  }
})();

/* ── TICKER ── */
(function () {
  const items = ['ISO 9001:2015 Certified', 'CNC Turning Specialists', 'VMC Machining', 'Pressure Die Casting', 'Coimbatore · Tamil Nadu', 'Est. 2004', '50+ Skilled Employees', '3 Shifts · 24×7', 'Cpk 1.66–1.7', 'NABL Calibrated', 'Automotive Grade Precision', 'Aluminum Die Casting'];
  const t = document.getElementById('ticker');
  const html = items.map(i => `<div class="ticker-item">${i}</div>`).join('');
  t.innerHTML = html + html + html;
})();

/* ── SCROLL REVEAL ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target) } });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

/* ── PARALLAX ── */
window.addEventListener('scroll', () => {
  const y = scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || .3;
    const rect = el.closest('section')?.getBoundingClientRect() || { top: 0 };
    el.style.transform = `translateY(${(y - el.closest('section')?.offsetTop || 0) * speed * 0.4}px)`;
  });
  /* Hero ANVIL hide and AUTOMATION show on scroll */
  const anvil = document.getElementById('heroAnvil');
  const auto = document.getElementById('heroAutomation');
  const navLogo = document.getElementById('navLogoName');
  if (anvil && auto && navLogo) {
    const prog = Math.min(y / window.innerHeight, 1);
    // Hide ANVIL in hero
    anvil.style.opacity = prog > .15 ? 0 : 1;
    anvil.style.transform = `translateY(${prog > .15 ? -50 : 0}px)`;
    // Show AUTOMATION in hero
    auto.style.opacity = prog > .15 ? 1 : 0;
    auto.style.transform = `translateY(${prog > .15 ? 0 : 100}px)`;
    auto.style.webkitTextStroke = `${prog > .15 ? 0 : 1}px rgba(255,255,255,.35)`;
    auto.style.color = prog > .15 ? 'white' : 'transparent';
    // Change nav logo name
    if (prog > .2) {
      navLogo.textContent = 'AUTOMATION';
    } else {
      navLogo.textContent = 'ANVIL';
    }
  }
}, { passive: true });

/* ── SPEC TABS ── */
const tabs = document.querySelectorAll('.spec-tab'), panels = document.querySelectorAll('.spec-panel');
function showTab(i) {
  tabs.forEach((t, j) => t.classList.toggle('active', i === j));
  panels.forEach((p, j) => p.classList.toggle('active', i === j));
}

/* ── ICON CLOUD ── */
(function () {
  const wrap = document.getElementById('cloudTagsWrap');
  if (!wrap) return;
  const labels = [
    'CNC', 'VMC', 'LMW', 'SAFAL', 'SGS', 'HMT', 'Fanuc',
    'Turning', 'Milling', 'Drilling', 'Tapping', 'Boring', 'Threading', 'Facing', 'Casting',
    'ISO 9001', 'PPAP', 'Cpk', 'NABL',
    'Aluminum', 'Steel', 'Ferrous',
    '120 Ton', '6000 RPM', '200mm', 'Indexer', 'Precision', 'Automotive'
  ];
  const R = 170, cx = 50, cy = 50;
  const els = [];
  labels.forEach((label, i) => {
    const phi = Math.acos(-1 + 2 * (i + .5) / labels.length);
    const theta0 = Math.PI * (1 + Math.sqrt(5)) * i;
    const el = document.createElement('span');
    el.textContent = label;
    el.style.cssText = `position:absolute;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:100px;white-space:nowrap;pointer-events:none;transition:none`;
    wrap.appendChild(el);
    els.push({ el, phi, theta0 });
  });
  let angle = 0, raf;
  function spin() {
    angle += .004;
    els.forEach(({ el, phi, theta0 }) => {
      const theta = theta0 + angle;
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.sin(phi) * Math.sin(theta);
      const z = R * Math.cos(phi);
      const px = cx + x * 0.48;
      const py = cy + y * 0.48;
      const depth = (z + R) / (2 * R);
      const opacity = Math.max(.12, depth * .9);
      const scale = .65 + depth * .55;
      const isBlue = depth > .6;
      el.style.left = px + '%';
      el.style.top = py + '%';
      el.style.transform = `translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = Math.round(depth * 100);
      el.style.background = isBlue ? 'rgba(17,71,168,.09)' : 'rgba(107,122,141,.06)';
      el.style.color = isBlue ? '#1147A8' : '#6B7A8D';
      el.style.border = `1px solid ${isBlue ? 'rgba(17,71,168,.18)' : 'rgba(107,122,141,.12)'}`;
    });
    raf = requestAnimationFrame(spin);
  }
  spin();
})();

/* ── TESTIMONIALS ── */
(function () {
  const data = [
    { name: 'Rajesh Kumar', co: 'Motherson Automotive', loc: 'Chennai', text: 'Anvil Automation delivers precision components with zero rejections across three consecutive orders. Their CNC turning quality is consistently outstanding.', stars: 5 },
    { name: 'Suresh Babu', co: 'RND Gears Pvt Ltd', loc: 'Bangalore', text: 'Excellent dimensional tolerances. SAFAL TURN-5 output matches our tightest specs. Highly recommended for automotive-grade components.', stars: 5 },
    { name: 'Anand K.', co: 'MN Auto Products', loc: 'Coimbatore', text: 'VMC machined parts fit perfectly in our assemblies every time. The 24/7 production capability means we never face delivery delays.', stars: 5 },
    { name: 'Priya Shankar', co: 'L.G. Balakrishnan Bros', loc: 'Coimbatore', text: 'ISO 9001:2015 quality is visible in every batch delivered. Die casting components consistently pass incoming inspection at first check.', stars: 5 },
    { name: 'Venkat R.', co: 'Tildenet', loc: 'Karur', text: 'Reliable partner for precision engineering components. Quality control and delivery track record is impeccable across all orders.', stars: 5 },
    { name: 'Karthik S.', co: 'Motherson T&E', loc: 'Chennai', text: 'Aluminum die casting parts meet ASTM Level 3 standards without exception. Five-year partnership — consistent, trustworthy, precise.', stars: 5 },
  ];
  function card(d, i) {
    return `<div class="mq-card">
      <div class="mq-stars">${'★'.repeat(d.stars)}</div>
      <p class="mq-text">"${d.text}"</p>
      <div class="mq-author">
        <div class="mq-av">${d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        <div><div class="mq-name">${d.name}</div><div class="mq-co">${d.co} · ${d.loc}</div></div>
      </div>
    </div>`;
  }
  const r1 = document.getElementById('mqRow1'), r2 = document.getElementById('mqRow2');
  const all = data.map(card).join('');
  const rev = [...data].reverse().map(card).join('');
  r1.innerHTML = all + all;
  r2.innerHTML = rev + rev;
})();

/* ── GLOBE (Canvas — proper geographic rendering) ── */
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 460, H = 460, CX = 230, CY = 230, R = 210;
  let phi = 0.4, dragging = false, lastX = 0;

  /* Simplified but recognisable world land polygons [lat,lng] */
  const lands = {
    india: [
      [8.1, 77.5], [8.5, 76.9], [9.5, 76.5], [10.5, 76.0], [11, 75.5], [12, 74.9], [13, 74.8], [14, 74.2], [15, 74.0], [16, 73.8],
      [17, 73.5], [18, 73.2], [19, 72.8], [20, 72.5], [21, 72.8], [22, 69.0], [23, 68.5], [24, 68.8], [25, 68.4], [26.5, 70.0],
      [27, 70.5], [27.5, 71.2], [28, 72.0], [29, 73.0], [30, 74.5], [31, 75.5], [32, 76.5], [33, 76.0], [34.5, 74.5], [34, 73.0],
      [32.5, 70.5], [31.5, 69.5], [30, 67.0], [28.5, 64.0], [26, 63.5], [23.5, 62.0], [22, 60.5], [20.5, 59.5], [19, 58.0],
      [15, 52.0], [13, 48.0], [11.5, 44.0], [10.5, 42.0], [8.5, 42.5], [7.5, 45.0], [8.0, 50.0], [8.5, 56.0], [9, 60.0],
      [9.5, 64.0], [10, 67.0], [9.5, 71.5], [8.5, 74.5], [8.1, 77.5]
    ],
    /* South Asia region simplified */
    sriLanka: [[9.8, 79.8], [8.0, 81.0], [6.0, 81.5], [5.9, 80.2], [6.8, 79.8], [8.5, 79.5], [9.8, 79.8]],
    /* Africa simplified */
    africa: [
      [37, 10], [35, 25], [30, 35], [25, 37], [20, 40], [15, 42], [10, 45], [5, 42], [0, 42], [-5, 40], [-10, 38],
      [-15, 35], [-20, 34], [-25, 33], [-30, 29], [-34, 25], [-34, 18], [-30, 17], [-25, 15], [-20, 14], [-15, 12],
      [-10, 14], [-5, 10], [0, 9], [5, 2], [10, -5], [15, -17], [20, -17], [25, -15], [30, -10], [33, -5], [36, 10], [37, 10]
    ],
    /* Europe simplified */
    europe: [
      [36, 5], [40, 20], [45, 28], [50, 30], [55, 24], [58, 20], [60, 24], [65, 22], [68, 20], [65, 14], [60, 10], [55, 8],
      [50, 2], [45, 0], [40, -2], [36, 5]
    ],
    /* North America simplified */
    namerica: [
      [70, -140], [65, -170], [58, -170], [55, -165], [50, -127], [45, -125], [40, -125], [35, -120], [30, -115], [25, -108], [20, -105],
      [15, -92], [10, -83], [8, -77], [8, -76], [12, -62], [16, -62], [20, -73], [25, -80], [30, -81], [35, -75], [40, -70], [45, -64],
      [50, -56], [55, -60], [60, -65], [65, -70], [68, -72], [70, -95], [72, -130], [70, -140]
    ],
    /* South America */
    samerica: [
      [12, -72], [10, -62], [8, -63], [4, -52], [0, -50], [-5, -35], [-10, -38], [-15, -40], [-20, -41], [-25, -48],
      [-30, -51], [-35, -57], [-38, -57], [-42, -64], [-45, -66], [-50, -69], [-55, -68], [-53, -58], [-46, -52],
      [-38, -50], [-30, -48], [-22, -44], [-15, -38], [-8, -35], [-3, -38], [0, -50], [5, -53], [8, -60], [12, -72]
    ],
    /* Australia */
    australia: [
      [-15, 130], [-16, 128], [-19, 122], [-22, 114], [-28, 114], [-32, 116], [-34, 119], [-36, 136], [-38, 140],
      [-38, 148], [-35, 150], [-32, 152], [-28, 153], [-22, 150], [-18, 146], [-14, 136], [-12, 130], [-14, 128], [-15, 130]
    ],
    /* Asia (Eastern) */
    asia: [
      [70, 30], [65, 50], [60, 60], [55, 60], [50, 70], [45, 75], [40, 72], [36, 62], [32, 48], [30, 48], [26, 56], [22, 58],
      [18, 66], [14, 74], [18, 82], [22, 88], [26, 90], [30, 92], [32, 100], [28, 106], [22, 110], [15, 108], [10, 107], [5, 103],
      [1, 104], [0, 108], [5, 115], [10, 125], [15, 120], [20, 120], [25, 115], [30, 120], [35, 120], [40, 125], [45, 135],
      [50, 142], [55, 162], [60, 163], [65, 172], [68, 170], [72, 140], [75, 105], [78, 80], [72, 60], [68, 40], [70, 30]
    ]
  };

  function project(lat, lng, rot) {
    const latR = lat * Math.PI / 180;
    const lngR = (lng + rot * 180 / Math.PI + 180) * Math.PI / 180;
    const x = R * Math.cos(latR) * Math.sin(lngR);
    const y = -R * Math.sin(latR);
    const z = R * Math.cos(latR) * Math.cos(lngR);
    return { x: CX + x, y: CY + y, z, vis: z > -R * .05 };
  }

  function drawPath(pts, rot) {
    ctx.beginPath();
    let first = true, skipped = false;
    for (let i = 0; i < pts.length; i++) {
      const p = project(pts[i][0], pts[i][1], rot);
      /* check big jump (wrap-around) */
      if (i > 0 && !first) {
        const prev = project(pts[i - 1][0], pts[i - 1][1], rot);
        if (Math.abs(p.x - prev.x) > 100 || !p.vis) { first = true; skipped = true; continue }
      }
      if (!p.vis) { first = true; skipped = true; continue }
      first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      first = false; skipped = false;
    }
    return !skipped;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    /* Ocean */
    const oceanGrad = ctx.createRadialGradient(CX - 60, CY - 60, 10, CX, CY, R);
    oceanGrad.addColorStop(0, '#EBF2FC');
    oceanGrad.addColorStop(.6, '#D9E8F7');
    oceanGrad.addColorStop(1, '#C4D9F0');
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = oceanGrad; ctx.fill();

    /* Globe border */
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(17,71,168,.12)'; ctx.lineWidth = 1; ctx.stroke();

    /* Grid */
    ctx.strokeStyle = 'rgba(17,71,168,.05)'; ctx.lineWidth = .7;
    for (let lat = -75; lat <= 75; lat += 15) {
      ctx.beginPath(); let f = true;
      for (let lng = -180; lng <= 180; lng += 2) {
        const p = project(lat, lng, phi);
        if (!p.vis) { f = true; continue }
        f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false;
      }
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      ctx.beginPath(); let f = true;
      for (let lat = -88; lat <= 88; lat += 2) {
        const p = project(lat, lng, phi);
        if (!p.vis) { f = true; continue }
        f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false;
      }
      ctx.stroke();
    }

    /* Equator highlight */
    ctx.beginPath(); let f2 = true;
    for (let lng = -180; lng <= 180; lng += 1) {
      const p = project(0, lng, phi);
      if (!p.vis) { f2 = true; continue }
      f2 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f2 = false;
    }
    ctx.strokeStyle = 'rgba(17,71,168,.1)'; ctx.lineWidth = 1; ctx.stroke();

    /* Landmasses */
    Object.entries(lands).forEach(([name, pts]) => {
      drawPath(pts, phi);
      if (name === 'india') {
        ctx.fillStyle = 'rgba(17,71,168,.25)';
      } else {
        ctx.fillStyle = 'rgba(17,71,168,.1)';
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(17,71,168,.18)'; ctx.lineWidth = .8; ctx.stroke();
    });

    /* Coimbatore marker */
    const cbr = project(11.0168, 76.9558, phi);
    if (cbr.vis) {
      /* Glow rings */
      [20, 13, 7].forEach((r, i) => {
        ctx.beginPath(); ctx.arc(cbr.x, cbr.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,91,26,${.06 + i * .04})`; ctx.fill();
      });
      /* Core dot */
      ctx.beginPath(); ctx.arc(cbr.x, cbr.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#E85B1A'; ctx.fill();
      ctx.beginPath(); ctx.arc(cbr.x, cbr.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'white'; ctx.fill();
    }

    /* Shine */
    const shine = ctx.createRadialGradient(CX - 70, CY - 70, 0, CX - 70, CY - 70, R * .9);
    shine.addColorStop(0, 'rgba(255,255,255,.32)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = shine; ctx.fill();

    /* Clip */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.clip(); ctx.restore();
  }

  let animPhi = 0;
  function loop() {
    if (!dragging) phi += .003;
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; canvas.style.cursor = 'grabbing' });
  window.addEventListener('mouseup', () => { dragging = false; canvas.style.cursor = 'grab' });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    phi += (e.clientX - lastX) * .007; lastX = e.clientX; draw();
  });
  canvas.addEventListener('touchstart', e => { dragging = true; lastX = e.touches[0].clientX }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    phi += (e.touches[0].clientX - lastX) * .007; lastX = e.touches[0].clientX;
  }, { passive: true });
})();

/* ── HERO AUTOMATION SCROLL INIT ── */
(function () {
  const auto = document.getElementById('heroAutomation');
  if (auto) { auto.style.opacity = '0'; auto.style.transition = 'none' }
})();

/* ── DOCK HIDE ON MOBILE SCROLL ── */
let lastSY = 0, dockEl = document.getElementById('mainDock');
window.addEventListener('scroll', () => {
  const cur = scrollY;
  if (window.innerWidth < 600) { dockEl.style.opacity = cur < 60 ? '0' : '1' }
  lastSY = cur;
}, { passive: true });
