(() => {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;

  const controls = "button, a[href], input[type='button'], input[type='submit'], [role='button'], [role='link']";
  let audio;
  let clickBuffer;

  function prepareAudio() {
    if (!audio) {
      audio = new AudioEngine();
      clickBuffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.035), audio.sampleRate);
      const samples = clickBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i += 1) {
        samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
      }
    }

    if (audio.state === "suspended") {
      audio.resume();
    }
  }

  function playClick() {
    prepareAudio();

    const now = audio.currentTime;
    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const volume = audio.createGain();

    source.buffer = clickBuffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(0.8, now);
    volume.gain.setValueAtTime(0.055, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    source.connect(filter);
    filter.connect(volume);
    volume.connect(audio.destination);
    source.start(now);
    source.stop(now + 0.035);
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
