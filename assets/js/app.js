(() => {
  const menu = document.querySelector('.menu'); const nav = document.querySelector('.nav');
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('menu-open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('menu-open'); menu?.setAttribute('aria-expanded','false'); }));
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}), {threshold:.08}); items.forEach((el,i)=>{el.style.transitionDelay=Math.min(i*35,350)+'ms';io.observe(el)}); } else items.forEach(e=>e.classList.add('visible'));
  const glow = document.querySelector('.cursor-glow'); window.addEventListener('pointermove', e => { if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}}, {passive:true});
})();
