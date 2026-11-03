(() => {
  const hero = document.querySelector('.starfield-hero');
  const button = hero?.querySelector('.starfield-motion');
  if (!button) return;
  button.addEventListener('click', () => {
    const paused = hero.classList.toggle('starfield-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? '播放流星' : '暂停流星';
    button.setAttribute('aria-label', paused ? '播放流星动画' : '暂停流星动画');
  });
  let visible = true;
  const sync = () => hero.classList.toggle('starfield-offscreen', !visible || document.hidden);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(hero);
  }
})();
