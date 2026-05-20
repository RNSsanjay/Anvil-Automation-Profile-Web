/* ── CURSOR + FIRE SPARKLE ── */
(function () {
  const cDot = document.getElementById('cDot');
  const cRing = document.getElementById('cRing');
  if (!cDot || !cRing) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let moveTimer = null;
  let isMoving = false;

  // Sparkle particle pool
  const SPARK_COLORS = [
    '#FF6B35', '#FF8C42', '#FFA552', '#FFD166', '#FFEC8A',
    '#FF4500', '#FF6000', '#FFA000', '#FFCC00', '#fff'
  ];

  function spawnSpark(x, y) {
    const el = document.createElement('div');
    const size = 3 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 2; // slight upward bias (fire)
    const life = 500 + Math.random() * 500;
    const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

    el.style.cssText = `
      position:fixed;
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${color};
      pointer-events:none;
      z-index:9990;
      transform:translate(-50%,-50%);
      box-shadow:0 0 ${size * 2}px ${color};
      transition:opacity ${life}ms ease-out;
      opacity:1;
    `;
    document.body.appendChild(el);

    let startTime = null;
    function animateSpark(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = elapsed / life;
      if (progress >= 1) { el.remove(); return; }
      const curX = x + vx * elapsed * 0.06;
      const curY = y + vy * elapsed * 0.06 + 0.5 * 0.04 * elapsed * elapsed * 0.01; // gravity
      el.style.left = curX + 'px';
      el.style.top = curY + 'px';
      el.style.opacity = 1 - progress;
      el.style.transform = `translate(-50%,-50%) scale(${1 - progress * 0.5})`;
      requestAnimationFrame(animateSpark);
    }
    requestAnimationFrame(animateSpark);
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px';
    cDot.style.top = my + 'px';

    // Spawn 2-4 sparks per move
    if (Math.random() > 0.3) {
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        spawnSpark(mx + (Math.random() - 0.5) * 8, my + (Math.random() - 0.5) * 8);
      }
    }

    // Show ring on move
    cRing.style.opacity = '1';
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { cRing.style.opacity = '0'; }, 300);
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cRing.style.left = rx + 'px';
    cRing.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ── PROGRESS BAR ── */
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  prog.style.width = pct + '%';
}, { passive: true });

/* ── NAV SCROLL ── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('solid', scrollY > 60);
  mainNav.classList.toggle('on-hero', scrollY <= 60);
}, { passive: true });
mainNav.classList.add('on-hero');

/* ── SERVICE CARD GLOW EFFECT ── */
document.querySelectorAll('.svc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--y', `${y}%`);
  });
});


/* ── MOBILE MENU ── */
function toggleMob() { document.getElementById("mobNav").classList.toggle("on"); document.querySelector(".ham").classList.toggle("on"); }

/* ── CHATBOT FUNCTION ── */
function openChatbot() {
  window.location.href = 'axis-ai.html';
  console.log('Chatbot clicked - Navigating to Axis AI');
}

/* ── METEORS ── */
(function () {
  const l = document.getElementById('meteorLayer');
  for (let i = 0; i < 22; i++) {
    const m = document.createElement('div');
    m.className = 'mt';
    const left = 5 + Math.random() * 110, top = Math.random() * 80;
    const dur = 2.5 + Math.random() * 4.5, delay = Math.random() * 12, len = 48 + Math.random() * 90;
    m.style.cssText = `left:${left}%;top:${top}%;height:${len}px;animation-duration:${dur}s;animation-delay:${delay}s`;
    l.appendChild(m);
  }
})();

/* ── SLIDESHOWS ── */
(function () {
  function initSlideshow(id) {
    const slideshow = document.getElementById(id);
    if (!slideshow) return;
    const slides = slideshow.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    let current = 0;
    function nextSlide() {
      slides[current].classList.remove('active');
      let next;
      do {
        next = Math.floor(Math.random() * slides.length);
      } while (next === current && slides.length > 1);
      current = next;
      slides[current].classList.add('active');
    }
    setInterval(nextSlide, 5000);
  }
  initSlideshow('heroSlideshow');
  initSlideshow('ownerSlideshow');
})();

/* ── DEVICE-AWARE CINEMATIC INTRO overlay ── */
(function () {
  const intro = document.getElementById('introOverlay');
  if (!intro) return;

  const isDesktopLapTab = window.innerWidth >= 768;

  if (!isDesktopLapTab) {
    // For smaller screens (other mobile devices): completely bypass/remove immediately
    intro.remove();
    return;
  }

  // Desktops, laptops, and tablets: play cinematic intro
  intro.style.display = 'block';
  const vid = document.getElementById('introVideo');
  const bar = document.getElementById('introProgressBar');
  let rafId = null;

  function hideIntro() {
    cancelAnimationFrame(rafId);
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      intro.classList.add('hidden');
      setTimeout(() => { intro.remove(); }, 1100);
    }, 200);
  }

  function updateBar() {
    if (!vid || vid.paused || vid.ended) return;
    if (vid.duration > 0) {
      const pct = (vid.currentTime / vid.duration) * 100;
      if (bar) bar.style.width = pct + '%';
    }
    rafId = requestAnimationFrame(updateBar);
  }

  window.skipIntro = hideIntro;

  if (vid) {
    vid.addEventListener('canplay', () => { vid.classList.add('loaded'); }, { once: true });
    vid.addEventListener('playing', () => { 
      updateBar(); 
      // Fade out cinematic text after 3 seconds
      setTimeout(() => {
        const introCenter = document.querySelector('.intro-center');
        if (introCenter) {
          introCenter.classList.add('fade-out');
        }
      }, 3000);
    });
    vid.addEventListener('ended', hideIntro);
    // Safety timeout: auto fadeout after 8 seconds
    setTimeout(hideIntro, 8000);
  } else {
    setTimeout(hideIntro, 500);
  }
})();

/* ── CAPABILITIES STRIP ── */
(function () {
  const caps = [
    { name: 'CNC Turning', tag: 'LMW · SAFAL × 5 · SGS', icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>' },
    { name: 'VMC Machining', tag: 'Fanuc · 6000 RPM · Indexer', icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' },
    { name: 'Pressure Die Casting', tag: '3× HMT 120 Ton · ASTM L3', icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' },
    { name: 'Scrap Trading', tag: 'Aluminum · Non-ferrous · Recycling', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' },
    { name: 'ISO 9001:2015', tag: 'Quality Certified', icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>' },
    { name: 'PPAP Documentation', tag: 'Process Control', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>' },
    { name: '3 Shifts · 24×7', tag: 'Coimbatore · Est. 2004', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  ];
  const track = document.getElementById('capsTrack');
  if (track) {
    const html = caps.map(c => `<div class="cap-item">
      <div class="cap-ico"><svg width="18" height="18" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${c.icon}</svg></div>
      <div><div class="cap-name">${c.name}</div><div class="cap-tag">${c.tag}</div></div>
    </div>`).join('');
    track.innerHTML = html + html + html;
  }
})();

/* ── TICKER ── */
(function () {
  const items = ['ISO 9001:2015 Certified', 'CNC Turning Specialists', 'VMC Machining', 'Pressure Die Casting', 'Coimbatore · Tamil Nadu', 'Est. 2004', '50+ Skilled Employees', '3 Shifts · 24×7', 'Cpk 1.66–1.7', 'NABL Calibrated', 'Automotive Grade Precision', 'Aluminum Die Casting', 'Zero Rejection Quality'];
  const t = document.getElementById('tickerTrack');
  if (t) {
    const html = items.map(i => `<div class="tick-item">${i}</div>`).join('');
    t.innerHTML = html + html + html;
  }
})();

/* ── SCROLL REVEAL ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .05, rootMargin: '0px 0px -12px 0px' });

const revealEls = document.querySelectorAll('[data-reveal]');
revealEls.forEach(el => revObs.observe(el));

// Safety pass: if user reloads mid-page, reveal anything already in viewport.
function revealVisibleNow() {
  revealEls.forEach(el => {
    if (el.classList.contains('visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('visible');
      revObs.unobserve(el);
    }
  });
}

window.addEventListener('load', revealVisibleNow, { once: true });
setTimeout(revealVisibleNow, 120);

/* ── ICON CLOUD ── */
(function () {
  const wrap = document.getElementById('cloudWrap');
  if (!wrap) return;
  const labels = ['CNC', 'VMC', 'LMW', 'SAFAL', 'SGS', 'HMT', 'Fanuc', 'Turning', 'Milling', 'Drilling', 'Tapping', 'Boring', 'Threading', 'Casting', 'ISO 9001', 'PPAP', 'Cpk', 'NABL', 'Aluminum', 'Steel', 'Ferrous', '120 Ton', '6000 RPM', '200mm', 'Indexer', 'Precision', 'Automotive', 'Coimbatore'];
  const R = 155;
  const items = [];
  labels.forEach((lbl, i) => {
    const phi = Math.acos(-1 + 2 * (i + .5) / labels.length);
    const theta0 = Math.PI * (1 + Math.sqrt(5)) * i;
    const el = document.createElement('span');
    el.textContent = lbl;
    el.style.cssText = 'position:absolute;font-family:DM Mono,monospace;font-size:10.5px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:100px;white-space:nowrap;pointer-events:none';
    wrap.appendChild(el);
    items.push({ el, phi, theta0 });
  });
  let ang = 0;
  (function spin() {
    ang += .0035;
    items.forEach(({ el, phi, theta0 }) => {
      const th = theta0 + ang;
      const x = R * Math.sin(phi) * Math.cos(th);
      const y = R * Math.sin(phi) * Math.sin(th);
      const z = R * Math.cos(phi);
      const d = (z + R) / (2 * R);
      const sc = .62 + d * .58;
      const op = Math.max(.1, d * .88);
      const blue = d > .55;
      el.style.left = (50 + x * 0.46) + '%';
      el.style.top = (50 + y * 0.46) + '%';
      el.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = Math.round(d * 100);
      el.style.background = blue ? 'rgba(15,63,181,.12)' : 'rgba(255,255,255,.06)';
      el.style.color = blue ? 'rgba(150,186,255,.9)' : 'rgba(255,255,255,.35)';
      el.style.border = `1px solid ${blue ? 'rgba(15,63,181,.3)' : 'rgba(255,255,255,.08)'}`;
    });
    requestAnimationFrame(spin);
  })();
})();

/* ── TESTIMONIALS ── */
(function () {
  const data = [
    { name: 'Rajesh Kumar', co: 'Motherson Automotive', loc: 'Chennai', txt: 'Anvil Automation delivers precision components with zero rejections across three consecutive order batches. Their CNC turning quality is consistently outstanding.', s: 5 },
    { name: 'Suresh Babu', co: 'RND Gears Pvt Ltd', loc: 'Bangalore', txt: 'Excellent dimensional tolerances every time. SAFAL TURN-5 output matches our tightest aerospace-grade specs. Highly recommended for automotive components.', s: 5 },
    { name: 'Anand K.', co: 'MN Auto Products', loc: 'Coimbatore', txt: 'VMC machined parts fit perfectly in our assemblies first time, every time. 24/7 production capability means we never face supply chain delays.', s: 5 },
    { name: 'Priya Shankar', co: 'L.G. Balakrishnan Bros', loc: 'Coimbatore', txt: 'ISO 9001:2015 quality is clearly visible in every batch delivered. Die casting components pass our incoming QA inspection at first check, batch after batch.', s: 5 },
    { name: 'Venkat R.', co: 'Tildenet', loc: 'Karur', txt: 'Outstanding reliability for precision engineering components. Quality control systems and delivery track record are genuinely impeccable across all order volumes.', s: 5 },
    { name: 'Karthik S.', co: 'Motherson T&E', loc: 'Chennai', txt: 'Aluminum die casting parts consistently meet ASTM Level 3 standards. Five-year partnership with Anvil — consistent, trustworthy, precision engineered.', s: 5 },
  ];
  function card(d) {
    return `<div class="mq-card"><div class="mq-stars">${'★'.repeat(d.s)}</div><p class="mq-txt">"${d.txt}"</p><div class="mq-auth"><div class="mq-av">${d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div><div class="mq-name">${d.name}</div><div class="mq-co">${d.co} · ${d.loc}</div></div></div></div>`;
  }
  const r1 = document.getElementById('mqR1'), r2 = document.getElementById('mqR2');
  if (r1 && r2) {
    const all = data.map(card).join('');
    r1.innerHTML = all + all;
    r2.innerHTML = [...data].reverse().map(card).join('') + [...data].reverse().map(card).join('');
  }
})();

/* ── LOCATION DOT CANVAS ── */
(function () {
  const canvas = document.getElementById('locDotCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 420, H = 420;
  canvas.width = W; canvas.height = H;

  const COLS = 20, ROWS = 20;
  const SPACING_X = W / COLS;
  const SPACING_Y = H / ROWS;
  const CENTER_X = W / 2, CENTER_Y = H / 2;

  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const bx = (c + 0.5) * SPACING_X;
      const by = (r + 0.5) * SPACING_Y;
      const dist = Math.sqrt((bx - CENTER_X) ** 2 + (by - CENTER_Y) ** 2);
      dots.push({
        bx, by,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
        amp: 1.5 + Math.random() * 3,
        baseR: 1.2 + Math.random() * 1.6,
        dist,
      });
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.018;

    dots.forEach(d => {
      const wave = Math.sin(t * d.speed + d.phase);
      const x = d.bx + wave * d.amp;
      const y = d.by + Math.cos(t * d.speed * 0.7 + d.phase) * d.amp;
      const proximity = Math.max(0, 1 - d.dist / 240);
      const alpha = 0.08 + proximity * 0.35 + Math.abs(wave) * 0.12;
      const r = d.baseR * (0.8 + proximity * 0.6);

      // Accent color near center, white further out
      const isNearCenter = d.dist < 80;
      const color = isNearCenter
        ? `rgba(217,79,26,${alpha})`
        : `rgba(255,255,255,${alpha * 0.6})`;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── CLIENTS HORIZONTAL SCROLL ── */
(function () {
  const container = document.getElementById('partnerLogos');
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScrollInterval;
  let isHovering = false;
  
  // Calculate half width for seamless loop reset
  const getHalfWidth = () => container.scrollWidth / 2;
  
  // Auto-scroll animation with seamless loop
  function startAutoScroll() {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(() => {
      if (!isDown && !isHovering) {
        container.scrollLeft += 1;
        // Seamless loop: reset to start when reaching halfway point
        if (container.scrollLeft >= getHalfWidth()) {
          container.scrollLeft = 0;
        }
      }
    }, 30);
  }
  
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Mouse drag to scroll
  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    stopAutoScroll();
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('dragging');
    isHovering = false;
    startAutoScroll();
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('dragging');
    if (!isHovering) startAutoScroll();
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    const newScrollLeft = scrollLeft - walk;
    
    // Handle seamless loop during drag
    if (newScrollLeft >= getHalfWidth()) {
      container.scrollLeft = newScrollLeft - getHalfWidth();
      scrollLeft = container.scrollLeft;
      startX = x;
    } else if (newScrollLeft < 0) {
      container.scrollLeft = getHalfWidth() + newScrollLeft;
      scrollLeft = container.scrollLeft;
      startX = x;
    } else {
      container.scrollLeft = newScrollLeft;
    }
  });

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoScroll();
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    if (!isDown) startAutoScroll();
  });

  // Start auto-scrolling
  startAutoScroll();
})();


/* ── KV TABLE TOGGLE ── */
window.toggleKvMore = function () {
  const content = document.getElementById('kvMoreContent');
  const btn = document.getElementById('kvBtn');
  const btnText = document.getElementById('kvBtnText');
  if (!content || !btn || !btnText) return;

  if (content.classList.contains('open')) {
    content.classList.remove('open');
    btn.classList.remove('open');
    btnText.textContent = 'Show More Details';
  } else {
    content.classList.add('open');
    btn.classList.add('open');
    btnText.textContent = 'Show Less Details';
  }
};

/* -- REVEAL TEXT ON SCROLL -- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-text').forEach(el => revealObserver.observe(el));

/* ── SCROLL SPY ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobLinks = document.querySelectorAll('.mob-links a');

  function scrollSpy() {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for nav height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    const updateLinks = (links) => {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    updateLinks(navLinks);
    updateLinks(mobLinks);
  }

  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy(); // Initial call
})();

/* ── MOBILE SCROLL DIRECTION DOCK TOGGLE ── */
(function () {
  const dock = document.getElementById('mainDock');
  if (!dock) return;

  let lastScrollY = window.scrollY;

  function updateDockVisibility() {
    // Only apply in mobile view (screen width < 768px)
    if (window.innerWidth >= 768) {
      dock.classList.remove('dock-hidden');
      return;
    }

    const currentScrollY = window.scrollY;

    // Hide when at the very top of the page (landing page initial entry)
    if (currentScrollY < 100) {
      dock.classList.add('dock-hidden');
    } else {
      // Show when scrolling UP, hide when scrolling DOWN
      if (currentScrollY < lastScrollY) {
        dock.classList.remove('dock-hidden');
      } else if (currentScrollY > lastScrollY) {
        dock.classList.add('dock-hidden');
      }
    }

    lastScrollY = currentScrollY;
  }

  // Run on initial load/evaluation
  updateDockVisibility();

  window.addEventListener('scroll', updateDockVisibility, { passive: true });
})();

/* ── EASTER EGG: LOGO 10 CLICKS TOOLTIP ── */
(function () {
  const logo = document.querySelector('.nav-logo-wrap');
  if (!logo) return;

  // Only run on the landing page (index.html)
  const isLandingPage = window.location.pathname === '/' || 
                        window.location.pathname.endsWith('index.html') || 
                        window.location.pathname.endsWith('/') ||
                        (!document.querySelector('.portal-hero-img') && !document.querySelector('.machines-hero'));

  if (!isLandingPage) return;

  let clickCount = 0;
  let tooltip = null;
  let hideTimeout = null;

  logo.addEventListener('click', (e) => {
    // Intercept standard navigation to index.html since we are already on index.html
    e.preventDefault();
    clickCount++;

    if (clickCount >= 10) {
      showTooltip();
    } else {
      // smooth scroll to top if clicked before 10 times
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  function showTooltip() {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'dev-tooltip';
      tooltip.innerHTML = `
        <div class="dev-tooltip-header">Developed By</div>
        <div class="dev-tooltip-name">Sanjay N</div>
        <div class="dev-tooltip-company">from RNS Solutions</div>
        <div class="dev-tooltip-since">Since May 2005</div>
      `;
      logo.style.position = 'relative'; // Ensure tooltip coordinates are relative to the logo
      logo.appendChild(tooltip);
    }

    clearTimeout(hideTimeout);
    tooltip.classList.add('show');

    // Auto-hide after 3 seconds
    hideTimeout = setTimeout(() => {
      tooltip.classList.remove('show');
    }, 3000);
  }
})();
