/* Aladdin's Castle homepage: the castle builds itself across one day at the Castle. */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Years in business from the opening date, so the figure never goes stale.
  var opened = new Date(1993, 5, 28);
  var now = new Date();
  var years = now.getFullYear() - opened.getFullYear() -
    ((now.getMonth() < opened.getMonth() || (now.getMonth() === opened.getMonth() && now.getDate() < opened.getDate())) ? 1 : 0);
  document.querySelectorAll('[data-years]').forEach(function (el) {
    el.textContent = years;
    el.setAttribute('data-sc-count', '0 ' + years);
  });

  // The opening scene tucks under the header; publish its height for the CSS.
  var header = document.querySelector('.site-header');
  function setHdr() { if (header) document.documentElement.style.setProperty('--hdr', header.offsetHeight + 'px'); }
  setHdr();
  window.addEventListener('resize', setHdr);

  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  // ---- the folio: blocks fill by chapter, the clock walks 7 a.m. to 6 p.m.
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.fc-blocks [data-ch]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-folio-link]'));
  var timeEl = document.querySelector('[data-folio-time]');
  var folio = document.querySelector('.folio');
  // Clock stops (in minutes after midnight) at the top of each chapter.
  var stops = [420, 420, 540, 720, 900, 1080];

  blocks.forEach(function (b) {
    var ch = +b.getAttribute('data-ch');
    var siblings = blocks.filter(function (x) { return +x.getAttribute('data-ch') === ch; });
    b.style.transitionDelay = reduce ? '0ms' : (siblings.indexOf(b) * 70) + 'ms';
  });

  function fmt(mins) {
    mins = Math.round(mins / 10) * 10;
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h === 12 && m === 0) return 'Noon';
    var ap = h >= 12 ? 'p.m.' : 'a.m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }

  var last = -1, lastTime = '';
  function update() {
    var vh = window.innerHeight;
    var line = vh * 0.55;
    var reached = 0, frac = 0;
    for (var i = 0; i < chapters.length; i++) {
      var r = chapters[i].getBoundingClientRect();
      if (r.top <= line) {
        reached = i;
        frac = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
      }
    }
    var atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
    if (atEnd) { reached = chapters.length - 1; frac = 1; }

    if (reached !== last) {
      last = reached;
      blocks.forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-ch') <= reached); });
      links.forEach(function (a) {
        var n = +a.getAttribute('data-folio-link');
        if (n === reached) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      folio.classList.toggle('is-done', reached === chapters.length - 1);
      folio.classList.toggle('is-away', reached === 0);
    }

    var a = stops[reached], b = stops[Math.min(reached + 1, stops.length - 1)];
    var t = reached === chapters.length - 1 ? 'Pickup, 6:00 p.m.' : fmt(a + (b - a) * frac);
    if (t !== lastTime && timeEl) { timeEl.textContent = t; lastTime = t; }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // ---- hero: a gentle pointer drift, layers at different depths
  var stage = document.querySelector('[data-hero-stage]');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (stage && fine && !reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(step);
    });
    stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); });
    function step() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      stage.style.setProperty('--mx', cx.toFixed(4));
      stage.style.setProperty('--my', cy.toFixed(4));
      raf = (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(step) : 0;
    }
  }

  // Castle rises out of the dunes once its image is ready.
  var castleImg = document.querySelector('.hl--castle img');
  function landed() { document.documentElement.classList.add('castle-in'); }
  if (castleImg) { if (castleImg.complete) landed(); else castleImg.addEventListener('load', landed); }
})();
