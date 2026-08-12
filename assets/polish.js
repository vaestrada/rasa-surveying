/* ============================================================
   RASA concepts — shared reveal/stagger
   Per emil-design-eng: stagger 30–80ms, ease-out, never block
   interaction, and respect prefers-reduced-motion.
   Auto-tags known grid containers so no HTML edits are needed.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Containers whose direct children should cascade in.
  var GROUPS = [
    '.svcgrid', '.pgrid', '.grp', '.stats .wrap', '.ledger .wrap',
    '.isles', '.layers', '.tlrow', '.creds .wrap', '.inst', '.grp4',
    '.xsell', '.steps', '.eout', '.sgrid', '.crew', '.desks4', '.prac'
  ];

  var items = [];
  GROUPS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      kids.forEach(function (el, i) {
        // 55ms cascade, capped so a long grid never feels slow.
        el.setAttribute('data-rv', '');
        el.style.setProperty('--rv-d', Math.min(i * 55, 330) + 'ms');
        items.push(el);
      });
    });
  });

  if (!items.length) return;

  // Reduced motion (or no IO support): show everything, no cascade.
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.style.setProperty('--rv-d', '0ms');
      el.classList.add('rv-in');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('rv-in');
      io.unobserve(e.target); // once only — re-animating on scroll-up is noise
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

  items.forEach(function (el) { io.observe(el); });

  // Safety net: anything already in view at load reveals immediately,
  // so a failed observer can never leave content invisible.
  window.addEventListener('load', function () {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('rv-in');
    });
  });
})();
