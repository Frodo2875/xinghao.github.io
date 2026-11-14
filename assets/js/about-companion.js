(() => {
  const counter = document.querySelector('[data-companion-since]');
  if (!counter) return;

  const day = 86_400_000;
  const beijingOffset = 8 * 60 * 60 * 1000;
  const start = Math.floor((Date.parse(counter.dataset.companionSince) + beijingOffset) / day);
  if (!Number.isFinite(start)) return;

  let timer;
  function refresh() {
    clearTimeout(timer);
    const now = Date.now() + beijingOffset;
    const today = Math.floor(now / day);
    counter.textContent = String(Math.max(0, today - start));
    timer = setTimeout(refresh, (today + 1) * day - now);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
  window.addEventListener('pageshow', refresh);
  refresh();
})();
