/* Extend Blowfish's preview without changing the theme submodule. */
(() => {
  const zoom = mediumZoom(document.querySelectorAll("img:not(.nozoom)"), {
    margin: 24,
    background: "rgba(0,0,0,0.75)",
    // Mobile browsers can adjust scroll anchoring during a pinch. Explicit
    // close gestures handle dismissal; a scroll adjustment must not close it.
    scrollOffset: Infinity,
  });
  let active = false;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  const pointers = new Map();
  let gesture = null;
  let gestureUsed = false;
  let suppressClickUntil = 0;
  let transforms = new Map();
  let positions = new Map();
  const hint = document.createElement("div");
  hint.className = "image-zoom-hint";
  hint.hidden = true;
  document.body.append(hint);

  const previews = () => document.querySelectorAll(".medium-zoom-image--opened");
  function render() {
    const offsetX = scrollX, offsetY = scrollY;
    previews().forEach((image) => {
      if (!transforms.has(image)) {
        transforms.set(image, image.style.transform);
        positions.set(image, { position: image.style.position, top: image.style.top, left: image.style.left });
        // Keep enlarged clones in the viewport instead of extending the
        // document, which can shift mobile scroll anchoring during a pinch.
        const top = parseFloat(image.style.top) - offsetY;
        const left = parseFloat(image.style.left) - offsetX;
        image.style.position = "fixed";
        image.style.top = `${top}px`;
        image.style.left = `${left}px`;
      }
      image.style.transform = `translate3d(${panX}px, ${panY}px, 0) ${transforms.get(image)} scale(${scale})`;
    });
    const controls = matchMedia("(pointer: coarse)").matches
      ? "双指缩放 · 单指拖动 · 轻点关闭"
      : "滚轮缩放 · 拖动查看 · Esc 关闭";
    hint.textContent = `${Math.round(scale * 100)}% · ${controls}`;
  }

  zoom.on("opened", () => {
    active = true;
    scale = 1;
    panX = panY = 0;
    transforms = new Map();
    positions = new Map();
    pointers.clear();
    gesture = null;
    gestureUsed = false;
    document.body.classList.add("image-wheel-zoom");
    document.documentElement.classList.add("image-preview-open");
    hint.hidden = false;
    render();
  });
  zoom.on("close", () => {
    active = false;
    pointers.clear();
    gesture = null;
    gestureUsed = false;
    suppressClickUntil = 0;
    transforms.forEach((transform, image) => {
      image.style.transform = transform;
      Object.assign(image.style, positions.get(image));
    });
    transforms.clear();
    positions.clear();
    document.body.classList.remove("image-wheel-zoom");
    document.documentElement.classList.remove("image-preview-open");
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

  function beginGesture() {
    const points = [...pointers.values()];
    if (!points.length) { gesture = null; return; }
    gesture = { panX, panY, scale, x: points[0].x, y: points[0].y };
    if (points.length < 2) return;
    const image = previews()[0];
    if (!image) { gesture = null; return; }
    const rect = image.getBoundingClientRect();
    gesture.x = (points[0].x + points[1].x) / 2;
    gesture.y = (points[0].y + points[1].y) / 2;
    gesture.distance = Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y));
    gesture.anchorX = gesture.x - rect.left - rect.width / 2;
    gesture.anchorY = gesture.y - rect.top - rect.height / 2;
    gestureUsed = true;
  }
  document.addEventListener("pointerdown", (event) => {
    if (!active || event.button !== 0) return;
    const target = event.target;
    const onImage = target.matches(".medium-zoom-image--opened");
    const onBackdrop = event.pointerType === "touch" && target.matches(".medium-zoom-overlay");
    if (!onImage && !onBackdrop) return;
    event.preventDefault();
    if (!pointers.size) {
      gestureUsed = false;
      suppressClickUntil = 0;
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    target.setPointerCapture(event.pointerId);
    beginGesture();
  }, true);
  document.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.values()];
    if (points.length >= 2) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const x = (points[0].x + points[1].x) / 2;
      const y = (points[0].y + points[1].y) / 2;
      scale = Math.max(0.5, Math.min(6, gesture.scale * distance / gesture.distance));
      const ratio = scale / gesture.scale;
      panX = gesture.panX + x - gesture.x + gesture.anchorX * (1 - ratio);
      panY = gesture.panY + y - gesture.y + gesture.anchorY * (1 - ratio);
    } else {
      const dx = points[0].x - gesture.x;
      const dy = points[0].y - gesture.y;
      if (Math.hypot(dx, dy) > 4) gestureUsed = true;
      if (!gestureUsed) return;
      panX = gesture.panX + dx;
      panY = gesture.panY + dy;
    }
    render();
  }, true);
  function endPointer(event) {
    if (!pointers.delete(event.pointerId)) return;
    if (gestureUsed) suppressClickUntil = performance.now() + 500;
    // Rebase after one finger lifts so continuing to drag does not jump.
    beginGesture();
  }
  document.addEventListener("pointerup", endPointer, true);
  document.addEventListener("pointercancel", endPointer, true);
  document.addEventListener("lostpointercapture", endPointer, true);
  document.addEventListener("click", (event) => {
    if (active && performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
