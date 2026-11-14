(() => {
  const hero = document.getElementById("top");
  const photo = hero?.querySelector(".hero-portrait img");
  if (!photo) return;

  const canTilt = window.matchMedia(
    "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)"
  );
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function updateTilt() {
    frame = 0;
    const bounds = hero.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1));
    photo.style.transition = "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)";
    photo.style.transform = `perspective(900px) translate(${x * 9}px, ${y * 7}px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
  }

  function resetTilt() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!canTilt.matches) photo.style.removeProperty("transition");
    photo.style.removeProperty("transform");
  }

  hero.addEventListener("pointermove", (event) => {
    if (!canTilt.matches || event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(updateTilt);
  }, { passive: true });
  hero.addEventListener("pointerleave", resetTilt);
  hero.addEventListener("pointercancel", resetTilt);
  window.addEventListener("blur", resetTilt);
  canTilt.addEventListener("change", resetTilt);
})();
