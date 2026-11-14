(() => {
  const controls = "button, a[href], input[type='button'], input[type='submit'], [role='button'], [role='link']";
  const clickSound = new Audio("audio/soft-click.wav?v=1");

  clickSound.preload = "auto";
  clickSound.volume = 0.2;

  function playClick() {
    clickSound.currentTime = 0;
    const playback = clickSound.play();
    if (playback) playback.catch(() => {});
  }

  function isEnabledControl(target) {
    const control = target.closest(controls);
    return control && !control.matches(":disabled, [aria-disabled='true']");
  }

  document.addEventListener("pointerdown", (event) => {
    if (isEnabledControl(event.target)) {
      playClick();
    }
  }, true);

  document.addEventListener("click", (event) => {
    if (event.detail === 0 && isEnabledControl(event.target)) {
      playClick();
    }
  }, true);
})();
