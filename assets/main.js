/* ============================================================
   知暖學習工作室 — 共用 JavaScript
   ============================================================ */

/* ── 語言切換 ── */
function setLang(lang) {
  document.body.setAttribute('lang', lang);
  localStorage.setItem('zhunuan_lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = (lang === 'zh' && btn.dataset.lang === 'zh') ||
                     (lang === 'en' && btn.dataset.lang === 'en');
    btn.classList.toggle('active', isActive);
  });
}

/* ── Navbar 捲動效果 ── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 漢堡選單 ── */
function toggleMobileNav() {
  const nav  = document.getElementById('mobileNav');
  const btn  = document.getElementById('hamburger');
  if (!nav || !btn) return;
  const open = nav.classList.toggle('open');
  btn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

/* 點選選單連結後關閉 */
function initMobileNavClose() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      const btn = document.getElementById('hamburger');
      if (btn) btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── 標記當前頁面的導覽連結 ── */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── 滾動淡入動畫 ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.card, .news-item, .contact-info-item, .stat-item');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ── 數字計數動畫 ── */
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 25);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ── 聯絡表單送出提示 ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const originalHTML = btn.innerHTML;

    // 送出中狀態
    btn.innerHTML = '⏳ 傳送中...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // 成功
        btn.innerHTML = '✓ 已收到訊息！我們會盡快回覆您';
        btn.style.background = '#4A9B8F';
        form.reset();
      } else {
        // 失敗
        btn.innerHTML = '❌ 送出失敗，請直接 Email 或 Line 聯繫我們';
        btn.style.background = '#e05';
        btn.disabled = false;
      }
    } catch (err) {
      btn.innerHTML = '❌ 網路錯誤，請稍後再試';
      btn.style.background = '#e05';
      btn.disabled = false;
    }
  });
}

/* ── 初始化 ── */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('zhunuan_lang') || 'zh';
  setLang(savedLang);
  initNavbarScroll();
  initMobileNavClose();
  initActiveNav();
  initScrollReveal();
  initCounters();
  initContactForm();
});
