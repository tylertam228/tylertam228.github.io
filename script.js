(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle = document.getElementById('langToggle');
  const themeIcon = document.getElementById('themeIcon');
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Force dark theme only
  root.classList.remove('theme-dark', 'theme-light');
  root.classList.add('theme-dark');
  try { localStorage.removeItem('theme'); } catch (_) {}

  // i18n
  const I18N = {
    en: {
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.certificates': 'Certificates',
      'nav.contact': 'Contact',
      'btn.theme': 'Theme',
      'btn.lang': 'EN / 繁',
      'hero.tagline': 'Aspiring to become a Game Engineer',
      'hero.stat.education': 'CENGN @ CUHK',
      'hero.stat.focus': 'Game Dev',
      'cta.download_cv': 'Download CV',
      'cta.contact_me': 'Contact Me',
      'section.about': 'About / Education',
      'section.skills': 'Skills & Technologies',
      'section.experience': 'Work Experience',
      'section.projects': 'Selective Projects',
      'section.certificates': 'Certificates',
      'section.extracurricular': 'Extracurricular',
      'section.contact': 'Contact & Support',
      'support.text': 'If you enjoy my work, you can support me:',
      'support.bmac': 'Buy Me a Coffee',
      'footer.built': 'Built with HTML, CSS, and JavaScript'
    },
    zh: {
      'nav.about': '關於 / 教育',
      'nav.skills': '技能',
      'nav.projects': '項目',
      'nav.certificates': '證書',
      'nav.contact': '聯絡',
      'btn.theme': '主題',
      'btn.lang': '繁 / EN',
      'hero.tagline': '立志成為遊戲工程師',
      'hero.stat.education': '中大 CENGN',
      'hero.stat.focus': '遊戲開發',
      'cta.download_cv': '下載履歷',
      'cta.contact_me': '聯絡我',
      'section.about': '關於 / 教育',
      'section.skills': '技能與技術',
      'section.experience': '工作經驗',
      'section.projects': '重點項目',
      'section.certificates': '證書',
      'section.extracurricular': '課外活動',
      'section.contact': '聯絡與支持',
      'support.text': '如果喜歡我的作品，歡迎支持：',
      'support.bmac': '請我飲杯咖啡',
      'footer.built': '以 HTML、CSS、JavaScript 製作'
    }
  };

  const savedLang = localStorage.getItem('lang') || 'en';
  let currentLang = savedLang;

  function applyTranslations(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });
    localStorage.setItem('lang', lang);
  }

  applyTranslations(currentLang);

  // Remove translate feature if button not present

  // Sidebar interactions
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
  }
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('show');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }
  document.querySelectorAll('.sidebar-nav a').forEach((a) => a.addEventListener('click', closeSidebar));

  // Scroll reveal animations
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));

  // Blue data lines canvas animation
  const canvas = document.getElementById('dataLines');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lines = [];
  let rafId;

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnLines() {
    const count = Math.max(20, Math.floor((window.innerWidth + window.innerHeight) / 120));
    lines = new Array(count).fill(0).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() * 0.6 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 0.6 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      len: Math.random() * 120 + 60,
      hue: 190 + Math.random() * 30,
      alpha: 0.35 + Math.random() * 0.4
    }));
  }

  function tick() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    lines.forEach((l) => {
      l.x += l.vx; l.y += l.vy;
      if (l.x < -l.len) l.x = window.innerWidth + l.len;
      if (l.x > window.innerWidth + l.len) l.x = -l.len;
      if (l.y < -l.len) l.y = window.innerHeight + l.len;
      if (l.y > window.innerHeight + l.len) l.y = -l.len;

      const grad = ctx.createLinearGradient(l.x, l.y, l.x + l.len, l.y + l.len);
      grad.addColorStop(0, `hsla(${l.hue}, 100%, 60%, 0)`);
      grad.addColorStop(0.3, `hsla(${l.hue}, 100%, 60%, ${l.alpha * 0.3})`);
      grad.addColorStop(0.7, `hsla(${l.hue}, 100%, 60%, ${l.alpha})`);
      grad.addColorStop(1, `hsla(${l.hue}, 100%, 60%, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x + l.len, l.y + l.len);
      ctx.stroke();
    });
    rafId = requestAnimationFrame(tick);
  }

  function startAnimation() {
    if (!canvas || !ctx || prefersReduce) return;
    resizeCanvas();
    spawnLines();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    spawnLines();
  });

  startAnimation();

  // Equalize Certificates and Extracurricular card heights
  function equalizeCertHeights() {
    const container = document.querySelector('#certs .grid.two');
    if (!container) return;
    const cards = container.querySelectorAll('.card');
    if (cards.length < 2) return;
    // reset
    cards.forEach((c) => (c.style.minHeight = ''));
    let max = 0;
    cards.forEach((c) => {
      const h = c.getBoundingClientRect().height;
      if (h > max) max = h;
    });
    cards.forEach((c) => (c.style.minHeight = Math.ceil(max) + 'px'));
  }

  window.addEventListener('load', equalizeCertHeights);
  window.addEventListener('resize', equalizeCertHeights);
  equalizeCertHeights();

  // Hex grid animation
  const hexCanvas = document.getElementById('hexGrid');
  const hexCtx = hexCanvas ? hexCanvas.getContext('2d') : null;
  let hexRAF;

  function hexResize() {
    if (!hexCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    hexCanvas.width = Math.floor(window.innerWidth * dpr);
    hexCanvas.height = Math.floor(window.innerHeight * dpr);
    hexCanvas.style.width = window.innerWidth + 'px';
    hexCanvas.style.height = window.innerHeight + 'px';
    if (hexCtx) hexCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawHexGrid(time) {
    if (!hexCanvas || !hexCtx || prefersReduce) return;
    hexCtx.clearRect(0, 0, hexCanvas.width, hexCanvas.height);
    const size = 28; // hex radius
    const w = window.innerWidth;
    const h = window.innerHeight;
    const hStep = Math.sqrt(3) * size;
    const vStep = 1.5 * size;
    const t = (time || 0) * 0.0006;
    for (let y = -size; y < h + size; y += vStep) {
      for (let x = -size; x < w + size; x += hStep) {
        const offsetX = ((Math.floor(y / vStep) % 2) === 0) ? 0 : hStep / 2;
        const px = x + offsetX;
        const py = y;
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin((px + py) * 0.01 + t * 8));
        hexCtx.strokeStyle = `rgba(0, 224, 255, ${0.25 * pulse})`;
        hexCtx.lineWidth = 1;
        hexCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = Math.PI / 3 * i + Math.PI / 6;
          const hx = px + size * Math.cos(ang);
          const hy = py + size * Math.sin(ang);
          if (i === 0) hexCtx.moveTo(hx, hy); else hexCtx.lineTo(hx, hy);
        }
        hexCtx.closePath();
        hexCtx.stroke();
      }
    }
    hexRAF = requestAnimationFrame(drawHexGrid);
  }

  function startHex() {
    if (!hexCanvas || !hexCtx || prefersReduce) return;
    hexResize();
    cancelAnimationFrame(hexRAF);
    hexRAF = requestAnimationFrame(drawHexGrid);
  }

  window.addEventListener('resize', hexResize);
  startHex();
  
  // Links loader: centralize external URLs in links.json
  async function loadLinks() {
    try {
      const res = await fetch('links.json', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();

      // Update CV link
      if (data.cv) {
        const cvA = document.getElementById('cv-link');
        if (cvA) cvA.href = data.cv;
      }

      // Update / append certificates
      if (Array.isArray(data.certificates)) {
        const ul = document.querySelector('#certs .card ul.files');
        data.certificates.forEach((cert) => {
          if (!cert || !cert.url || !cert.label) return;
          const existing = cert.id ? document.getElementById(cert.id) : null;
          if (existing) {
            existing.href = cert.url;
            if (cert.label) existing.textContent = cert.label;
          } else if (ul) {
            const li = document.createElement('li');
            if (cert.icon) {
              const img = document.createElement('img');
              img.src = cert.icon;
              img.alt = cert.label || 'Certificate';
              li.appendChild(img);
            }
            const a = document.createElement('a');
            if (cert.id) a.id = cert.id;
            a.href = cert.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = cert.label;
            li.appendChild(a);
            ul.appendChild(li);
          }
        });
        // re-equalize heights after DOM change
        equalizeCertHeights();
      }
    } catch (_) {
      // ignore fetch/json errors silently
    }
  }

  // Load links after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLinks);
  } else {
    loadLinks();
  }
})();


