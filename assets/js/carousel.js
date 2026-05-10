/* =========================================================================
   ICA — CAROUSEL.JS
   Lightweight RTL-aware carousel for the courses page hero slideshow.
   Auto-advances every 5s, pauses on hover, dot navigation, keyboard.
   ========================================================================= */

(function () {
  'use strict';

  function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const slides = root.querySelectorAll('.carousel-slide');
    const dotsContainer = root.querySelector('.carousel-dots');
    if (!track || !slides.length) return;

    const total = slides.length;
    let current = 0;
    let timer;
    const intervalMs = 5500;

    // Build dots
    if (dotsContainer && !dotsContainer.children.length) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'الشريحة ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = (index + total) % total;
      // RTL: slide track to the LEFT (positive direction) so positive % moves right→left.
      // Using transform: translateX with positive values in an RTL container behaves
      // visually the same as negative values in LTR for this layout. We use negative
      // here because flex direction stays LTR inside the track.
      track.style.transform = 'translateX(' + (current * 100) + '%)';
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      stop();
      timer = setInterval(next, intervalMs);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // Keyboard
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { prev(); start(); }   // RTL: right key = previous
      if (e.key === 'ArrowLeft')  { next(); start(); }
    });

    // Touch
    let touchStartX = 0, touchEndX = 0;
    root.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 50) {
        // RTL: swipe right = previous, swipe left = next
        if (delta > 0) prev(); else next();
        start();
      }
    }, { passive: true });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  }

  function init() {
    document.querySelectorAll('.carousel').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
