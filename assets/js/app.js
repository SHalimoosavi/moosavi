
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

  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const navTargets = navLinks
    .map(link => ({link, target: document.getElementById(link.getAttribute('href').slice(1))}))
    .filter(item => item.target);

  const setActiveNav = (activeLink) => {
    navLinks.forEach(link => {
      if (link === activeLink) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  let pendingNavTarget = null;
  let previousScrollY = window.scrollY;

  const updateActiveNav = () => {
    const activationLine = 110;
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > previousScrollY;
    const scrollingUp = currentScrollY < previousScrollY;
    previousScrollY = currentScrollY;

    if (pendingNavTarget) {
      const rect = pendingNavTarget.target.getBoundingClientRect();
      if (rect.bottom <= activationLine || (scrollingUp && rect.top > activationLine)) {
        pendingNavTarget = null;
      } else if (rect.top <= activationLine) {
        setActiveNav(pendingNavTarget.link);
        pendingNavTarget = null;
        return;
      } else if (!scrollingUp) {
        setActiveNav(pendingNavTarget.link);
        return;
      } else {
        pendingNavTarget = null;
      }
    }
    const active = navTargets.find(item => {
      const rect = item.target.getBoundingClientRect();
      return rect.top <= activationLine && rect.bottom > activationLine;
    });
    if (active) {
      setActiveNav(active.link);
      return;
    }

    const previous = navTargets.filter(item => item.target.getBoundingClientRect().top <= activationLine).at(-1);
    if (previous) setActiveNav(previous.link);
    else setActiveNav(null);
  };

  const syncNavFromHash = () => {
    const targetId = window.location.hash.slice(1);
    const match = navTargets.find(item => item.target.id === targetId);
    if (match) {
      pendingNavTarget = match;
      setActiveNav(match.link);
    } else {
      pendingNavTarget = null;
      updateActiveNav();
    }
  };

  if (navTargets.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(updateActiveNav, {
      rootMargin: '-100px 0px -85% 0px',
      threshold: 0
    });
    navTargets.forEach(item => navObserver.observe(item.target));
    window.addEventListener('scroll', updateActiveNav, {passive: true});
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();
  }

  window.addEventListener('hashchange', syncNavFromHash);
  window.addEventListener('popstate', syncNavFromHash);
  if (window.location.hash) syncNavFromHash();

  const glow = document.querySelector('.cursor-glow');
  if (glow && !prefersReducedMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }
})();
