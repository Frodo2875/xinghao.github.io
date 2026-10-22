/* Extend Blowfish's preview without changing the theme submodule. */
(() => {
  const zoom = mediumZoom(document.querySelectorAll("img:not(.nozoom)"), {
    margin: 24,
    background: "rgba(0,0,0,0.75)",
    scrollOffset: 0,
  });
  let active = false;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let drag = null;
  let suppressClickUntil = 0;
  let transforms = new Map();
  const hint = document.createElement("div");
  hint.className = "image-zoom-hint";
  hint.hidden = true;
  document.body.append(hint);

  const previews = () => document.querySelectorAll(".medium-zoom-image--opened");
  function render() {
    previews().forEach((image) => {
      if (!transforms.has(image)) transforms.set(image, image.style.transform);
      image.style.transform = `translate3d(${panX}px, ${panY}px, 0) ${transforms.get(image)} scale(${scale})`;
    });
    hint.textContent = `${Math.round(scale * 100)}% · 滚轮缩放 · 拖动查看 · Esc 关闭`;
  }

  zoom.on("opened", () => {
    active = true;
    scale = 1;
    panX = panY = 0;
    transforms = new Map();
    document.body.classList.add("image-wheel-zoom");
    hint.hidden = false;
    render();
  });
  zoom.on("close", () => {
    active = false;
    drag = null;
    suppressClickUntil = 0;
    transforms.forEach((transform, image) => { image.style.transform = transform; });
    transforms.clear();
    document.body.classList.remove("image-wheel-zoom");
    hint.hidden = true;
  });

  document.addEventListener("wheel", (event) => {
    if (!active || event.ctrlKey) return;
    event.preventDefault();
    const image = previews()[0];
    if (!image) return;
    const rect = image.getBoundingClientRect();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const next = Math.max(0.5, Math.min(6, scale * Math.exp(-Math.max(-100, Math.min(100, delta)) * 0.002)));
    const ratio = next / scale;
    // Keep the point under the cursor steady while changing magnification.
    panX += (event.clientX - rect.left - rect.width / 2) * (1 - ratio);
    panY += (event.clientY - rect.top - rect.height / 2) * (1 - ratio);
    scale = next;
    render();
  }, { passive: false, capture: true });

  document.addEventListener("pointerdown", (event) => {
    if (!active || event.button !== 0 || !event.target.matches(".medium-zoom-image--opened")) return;
    event.preventDefault();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX, panY, moved: false };
    event.target.setPointerCapture(event.pointerId);
  }, true);
  document.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    panX = drag.panX + dx;
    panY = drag.panY + dy;
    render();
  }, true);
  document.addEventListener("pointerup", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) suppressClickUntil = performance.now() + 300;
    drag = null;
  }, true);
  document.addEventListener("pointercancel", () => { drag = null; }, true);
  document.addEventListener("click", (event) => {
    if (active && performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
