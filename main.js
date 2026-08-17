/* =========================================================================
   ICA - MAIN.JS
   Handles: partial injection (navbar/footer), mobile menu, smooth scroll,
   navbar shrink on scroll, active nav highlighting.
   ========================================================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────────
     Resolve base path so partials load whether the page is at:
       /                                  (custom domain root)
       /repo-name/                        (GitHub Pages project site)
       /repo-name/pages/<file>.html       (inner page on Pages)
       file:///.../index.html             (won't work without a server,
                                           but we still try gracefully)
     Strategy: walk UP from the current URL until we reach the project root.
     The project root is wherever index.html lives (one level above /pages/).
     ─────────────────────────────────────────────────────────────────── */
  function basePath() {
    const path = window.location.pathname;
    // Inside /pages/ - go up one level.
    if (/\/pages\//.test(path)) return '../';
    return './';
  }

  /* ─────────────────────────────────────────────────────────────────────
     Inject a partial (navbar / footer) into a container.
     Uses URL constructor (not string concat) so it works on every host.
     Fallback: render a minimal inline navbar/footer if fetch fails so
     the page never appears as "raw text."
     ─────────────────────────────────────────────────────────────────── */
  async function injectPartial(targetSelector, partialName) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    // Build the partial URL relative to the CURRENT document URL.
    // new URL('../partials/x', currentUrl) handles every deployment scenario
    // including subpaths like /repo-name/pages/foo.html.
    const partialUrl = new URL(basePath() + 'partials/' + partialName, window.location.href).href;

    try {
      const res = await fetch(partialUrl);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      let html = await res.text();

      // Rewrite hrefs that came from the partial as bare paths
      // (e.g. href="pages/services.html") into URLs relative to current page.
      html = html.replace(/href="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, (m, p1) => {
        const resolved = new URL(basePath() + p1, window.location.href).href;
        return 'href="' + resolved + '"';
      });
      target.innerHTML = html;
    } catch (err) {
      console.warn('[ICA] Partial fetch failed for ' + partialName + ':', err.message);
      console.warn('[ICA] Tried URL:', partialUrl);
      console.warn('[ICA] If you are opening the file via file:// - partials require a web server. Use GitHub Pages, or run: python3 -m http.server');
      // Fallback: inline minimal markup so the page is still usable.
      injectFallback(target, partialName);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
     Fallback partials - used only if fetch fails (e.g. file:// protocol
     or partials/ folder didn't deploy). Keeps the page navigable.
     ─────────────────────────────────────────────────────────────────── */
  function injectFallback(target, partialName) {
    const bp = basePath();
    if (partialName === 'navbar.html') {
      target.innerHTML = `
        <nav class="navbar" aria-label="القائمة الرئيسية">
          <a class="nav-brand" href="${bp}index.html" data-page="home">
            <span class="nav-logo" aria-hidden="true">ICA</span>
            <span class="nav-brand-text">
              <span class="nav-brand-name">أكاديمية المهن الذكية</span>
              <span class="nav-brand-en">Intelligent Career Academy</span>
            </span>
          </a>
          <ul class="nav-links">
            <li><a href="${bp}pages/services.html" data-page="services">خدماتنا</a></li>
            <li><a href="${bp}pages/courses.html" data-page="courses">الدورات</a></li>
            <li><a href="${bp}pages/conferences.html" data-page="conferences">المؤتمرات</a></li>
            <li><a href="${bp}pages/designs.html" data-page="designs">التصاميم</a></li>
            <li><a href="${bp}pages/labs.html" data-page="labs">المختبرات</a></li>
            <li><a href="${bp}pages/coming-soon.html?from=competitions" data-page="competitions">المسابقات</a></li>
          </ul>
          <a class="nav-cta" href="${bp}pages/consultation.html" data-page="consultation">طلب استشارة</a>
          <button class="menu-toggle" aria-label="فتح القائمة" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </nav>
        <div class="mobile-menu" aria-hidden="true">
          <a href="${bp}index.html" data-page="home">الرئيسية</a>
          <a href="${bp}pages/services.html" data-page="services">خدماتنا</a>
          <a href="${bp}pages/courses.html" data-page="courses">الدورات</a>
          <a href="${bp}pages/conferences.html" data-page="conferences">المؤتمرات</a>
          <a href="${bp}pages/designs.html" data-page="designs">التصاميم</a>
          <a href="${bp}pages/labs.html" data-page="labs">المختبرات</a>
          <a href="${bp}pages/coming-soon.html?from=competitions" data-page="competitions">المسابقات</a>
          <a class="nav-cta" href="${bp}pages/consultation.html" data-page="consultation">طلب استشارة</a>
        </div>
      `;
    } else if (partialName === 'footer.html') {
      target.innerHTML = `
        <footer class="footer" role="contentinfo">
          <div class="footer-inner">
            <div class="footer-bottom" style="border-top:none;padding-top:0;justify-content:center;">
              <span>© ${new Date().getFullYear()} أكاديمية المهن الذكية. جميع الحقوق محفوظة.</span>
            </div>
          </div>
        </footer>
      `;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
     Mobile menu toggle
     ─────────────────────────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.mobile-menu');
    if (!toggle || !overlay) return;

    const close = () => {
      toggle.classList.remove('active');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      toggle.classList.add('active');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      if (toggle.classList.contains('active')) close();
      else open();
    });
    // Close on link click
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     Navbar shrink on scroll
     ─────────────────────────────────────────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────────────
     Mark active page in navbar
     Match on filename (e.g. courses.html → [data-page="courses"]).
     ─────────────────────────────────────────────────────────────────── */
  function markActiveNavLink() {
    const path = window.location.pathname;
    let pageId = 'home';
    if (path.includes('services')) pageId = 'services';
    else if (path.includes('courses')) pageId = 'courses';
    else if (path.includes('conferences')) pageId = 'conferences';
    else if (path.includes('designs')) pageId = 'designs';
    else if (path.includes('labs')) pageId = 'labs';
    else if (path.includes('consultation')) pageId = 'consultation';
    else if (path.includes('afaq')) pageId = 'afaq';
    else if (path.includes('azar')) pageId = 'azar';

    document.querySelectorAll('[data-page]').forEach(a => {
      if (a.getAttribute('data-page') === pageId) a.classList.add('active');
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     Smooth-scroll polyfill for in-page anchor links
     ─────────────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     Coming-Soon: pull "from" param to enrich back-link copy
     ─────────────────────────────────────────────────────────────────── */
  function initComingSoonContext() {
    const ctxEl = document.querySelector('[data-coming-context]');
    if (!ctxEl) return;
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    if (!from) return;
    const labelMap = {
      courses: 'الدورات',
      conferences: 'المؤتمرات',
      labs: 'المختبرات',
      designs: 'التصاميم',
      services: 'الخدمات',
      afaq: 'برنامج آفاق',
      azar: 'برنامج آزار'
    };
    const label = labelMap[from];
    if (label) ctxEl.textContent = label;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Init
     ─────────────────────────────────────────────────────────────────── */
  async function init() {
    // Inject partials in parallel, then init the rest.
    await Promise.all([
      injectPartial('[data-include="navbar"]', 'navbar.html'),
      injectPartial('[data-include="footer"]', 'footer.html')
    ]);
    initMobileMenu();
    initNavbarScroll();
    markActiveNavLink();
    initSmoothScroll();
    initComingSoonContext();

    // Tell other scripts that partials are loaded
    document.dispatchEvent(new CustomEvent('ica:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
