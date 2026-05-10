/* =========================================================================
   ICA — ANIMATIONS.JS
   Scroll-reveal via IntersectionObserver + animated number counters.
   ========================================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────────────
     Scroll Reveal — adds .in-view to elements when they enter viewport.
     ─────────────────────────────────────────────────────────────────── */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal, .reveal-right, .reveal-left, .reveal-scale');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in-view'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────────
     Number Counter — animates `data-count="500"` from 0 → target.
     Keeps any existing suffix span (`<span class="stat-suffix">+</span>`).
     ─────────────────────────────────────────────────────────────────── */
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(el => {
        const suffix = el.querySelector('.stat-suffix');
        const target = parseInt(el.getAttribute('data-count'), 10);
        el.textContent = target.toLocaleString('ar-EG');
        if (suffix) el.appendChild(suffix);
      });
      return;
    }

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1800;
      const start = performance.now();
      const suffix = el.querySelector('.stat-suffix');
      const suffixHTML = suffix ? suffix.outerHTML : '';

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.innerHTML = value.toLocaleString('ar-EG') + suffixHTML;
        if (progress < 1) requestAnimationFrame(step);
        else el.innerHTML = target.toLocaleString('ar-EG') + suffixHTML;
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    els.forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────────
     Init  (also re-init after partials load, in case any reveals are
     inside the navbar/footer — currently there are none, but kept safe).
     ─────────────────────────────────────────────────────────────────── */
  function init() {
    initScrollReveal();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
