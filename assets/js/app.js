
(() => {
  const header = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  const firstLink = links?.querySelector('a');

  const setMenu = (open) => {
    if (!header || !menu) return;
    header.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (open) firstLink?.focus();
  };

  menu?.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header?.classList.contains('menu-open')) {
      setMenu(false);
      menu?.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!header?.classList.contains('menu-open')) return;
    if (!header.contains(e.target)) setMenu(false);
  });

  const items = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }), {threshold: .08});
    items.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 28, 240)}ms`; io.observe(el); });
  } else {
    items.forEach(el => { el.classList.add('visible'); el.style.transitionDelay = '0ms'; });
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && !prefersReducedMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }
})();
