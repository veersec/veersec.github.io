/* ═══════════════════════════════════════════
   VEERXX PORTFOLIO — script.js  v2
═══════════════════════════════════════════ */

// ── PRELOADER ──────────────────────────────
const MSGS = ['Booting system...','Loading modules...','Initializing recon...','Bypassing defenses...','Access granted ✓'];
let msgIdx = 0;
const preEl = document.getElementById('pre-msg');
const msgTimer = setInterval(() => {
  if (!preEl) return clearInterval(msgTimer);
  if (msgIdx < MSGS.length) preEl.textContent = MSGS[msgIdx++];
}, 360);

window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    pre.classList.add('out');
    setTimeout(() => { pre.style.display = 'none'; revealOnScroll(); }, 600);
  }, 2000);
});

// ── CUSTOM CURSOR ──────────────────────────
(function() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx=0,my=0,rx=0,ry=0;

  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

  function animCursor() {
    rx += (mx-rx) * 0.18;
    ry += (my-ry) * 0.18;
    dot.style.left  = mx+'px';
    dot.style.top   = my+'px';
    ring.style.left = rx+'px';
    ring.style.top  = ry+'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  const hoverEls = document.querySelectorAll('a,button,.sk-card,.proj-card,.cert-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ── PARTICLE CANVAS ────────────────────────
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const COUNT = 60;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial=false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.a  = Math.random() * 0.5 + 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = this.a * Math.sin(progress * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,232,122,${alpha})`;
      ctx.fill();
    }
  }

  for (let i=0;i<COUNT;i++) particles.push(new Particle());

  function drawLines() {
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,232,122,${(1-dist/100)*0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── NAVBAR ─────────────────────────────────
(function() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const dLinks = document.querySelectorAll('.dl');

  window.addEventListener('scroll', () => {
    header.classList.toggle('stuck', window.scrollY > 50);
  }, {passive:true});

  function openDrawer() {
    drawer.classList.add('on');
    overlay.classList.add('on');
    burger.classList.add('on');
  }
  function closeDrawer() {
    drawer.classList.remove('on');
    overlay.classList.remove('on');
    burger.classList.remove('on');
  }

  burger?.addEventListener('click', () => drawer.classList.contains('on') ? closeDrawer() : openDrawer());
  overlay?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);
  dLinks.forEach(l => l.addEventListener('click', closeDrawer));

  // active nav link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nl');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('on', l.getAttribute('href')==='#'+e.target.id));
      }
    });
  }, {threshold:0.4});
  sections.forEach(s => io.observe(s));
})();

// ── TYPED TEXT ─────────────────────────────
(function() {
  const el = document.getElementById('typeText');
  if (!el) return;
  const texts = ['VAPT Specialist','Penetration Tester','Ethical Hacker','Web App Security Expert','Network PenTester','Bug Bounty Hunter'];
  let ti=0, ci=0, del=false;
  function tick() {
    const cur = texts[ti];
    el.textContent = del ? cur.slice(0,ci--) : cur.slice(0,ci++);
    let delay = del ? 55 : 95;
    if (!del && ci > cur.length) { delay=1900; del=true; }
    else if (del && ci<0) { del=false; ci=0; ti=(ti+1)%texts.length; delay=350; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2600);
})();

// ── TERMINAL ───────────────────────────────
(function() {
  const body = document.getElementById('termBody');
  if (!body) return;
  const lines = [
    {t:'$ whoami',                        c:'tc', d:300},
    {t:'dharmveer — VAPT Specialist',     c:'to', d:700},
    {t:'',                                c:'',   d:800},
    {t:'$ cat skills.txt',                c:'tc', d:1100},
    {t:'VAPT | Web AppSec | Network PenTest | OSINT',c:'to',d:1500},
    {t:'',                                c:'',   d:1600},
    {t:'$ nmap -sV --script vuln target.com', c:'tc', d:1900},
    {t:'Starting Nmap 7.94SVN...',        c:'tw', d:2300},
    {t:'80/tcp   open  http',             c:'to', d:2700},
    {t:'443/tcp  open  https  ← VULN FOUND', c:'te', d:3000},
    {t:'8080/tcp open  http-proxy',       c:'to', d:3300},
    {t:'',                                c:'',   d:3400},
    {t:'$ sqlmap -u target.com/login --dbs', c:'tc', d:3800},
    {t:'[INFO] testing connection...    OK',c:'tw', d:4200},
    {t:'[✓] 3 databases found — CRITICAL',c:'te', d:4600},
    {t:'',                                c:'',   d:4700},
    {t:'$ echo "Target compromised 💀"', c:'tc', d:5100},
    {t:'Target compromised 💀',           c:'te', d:5500},
    {t:'',                                c:'',   d:5600},
    {t:'$ █',                             c:'tk', d:5900},
  ];
  const BASE = 2200;
  lines.forEach(({t,c,d}) => {
    setTimeout(() => {
      const div = document.createElement('div');
      if (c) div.className = c;
      div.textContent = t || '\u00A0';
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }, BASE + d);
  });
})();

// ── SCROLL REVEAL ──────────────────────────
function revealOnScroll() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const delay = i * 70;
      setTimeout(() => entry.target.classList.add('in'), delay);
      io.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el => io.observe(el));
}
// Run after preloader and also directly
setTimeout(revealOnScroll, 2800);
document.addEventListener('DOMContentLoaded', () => setTimeout(revealOnScroll, 100));

// ── COUNTERS ───────────────────────────────
(function() {
  const els = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(timer);
      }, 22);
      io.unobserve(el);
    });
  }, {threshold: 0.6});
  els.forEach(el => io.observe(el));
})();

// ── STATUS BAR CLOCK ───────────────────────
(function() {
  const el = document.getElementById('sclock');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toTimeString().slice(0,8) + ' IST';
  };
  update();
  setInterval(update, 1000);
})();

// ── CONTACT FORM ───────────────────────────
(function() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('formBtn');
  const label   = document.getElementById('btnLabel');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    label.textContent = 'Sending...';
    success.style.display = error.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {Accept: 'application/json'}
      });
      if (!res.ok) throw new Error();
      form.reset();
      success.style.display = 'block';
      label.textContent = 'Message Sent ✓';
      setTimeout(() => {
        label.textContent = 'Send Message';
        btn.disabled = false;
        success.style.display = 'none';
      }, 6000);
    } catch {
      error.style.display = 'block';
      label.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
})();

// ── SMOOTH SCROLL ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// ── AMBIENT GLOW follows cursor ────────────
(function() {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:'fixed', width:'600px', height:'600px',
    borderRadius:'50%',
    background:'radial-gradient(circle, rgba(0,232,122,0.025) 0%, transparent 65%)',
    pointerEvents:'none', zIndex:'1', transition:'left .08s, top .08s',
    transform:'translate(-50%,-50%)',
  });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX+'px';
    glow.style.top  = e.clientY+'px';
  });
})();
