(() => {
  const controls = "button, a[href], input[type='button'], input[type='submit'], [role='button'], [role='link']";
  const softClick = new Audio("audio/soft-click.wav?v=2");
  const toggleClick = new Audio("audio/ui-toggle.wav?v=1");
  const portfolioWhoosh = new Audio("audio/portfolio-whoosh.mp3?v=1");

  softClick.preload = "auto";
  softClick.volume = 0.08;
  toggleClick.preload = "auto";
  toggleClick.volume = 0.06;
  portfolioWhoosh.preload = "auto";
  portfolioWhoosh.volume = 0.04;

  function play(sound) {
    sound.currentTime = 0;
    const playback = sound.play();
    if (playback) playback.catch(() => {});
  }

  function soundForControl(control) {
    if (control.matches(".kx-nav-btn, .kx-side-card")) return portfolioWhoosh;
    if (control.matches(".nav-toggle, .lang-toggle, .faq-question")) return toggleClick;
    return softClick;
  }

  function playForTarget(target) {
    const control = target instanceof Element ? target.closest(controls) : null;
    if (!control || control.matches(":disabled, [aria-disabled='true']")) return;
    play(soundForControl(control));
  }

  document.addEventListener("pointerdown", (event) => {
    playForTarget(event.target);
  }, true);

  document.addEventListener("click", (event) => {
    if (event.detail === 0) playForTarget(event.target);
  }, true);
})();
