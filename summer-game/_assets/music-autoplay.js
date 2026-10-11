(() => {
  const audio = new Audio('/summer-game/assets/audio/txmy-solace-slowed.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.45;
  let enabled = true;

  const toggle = () => document.querySelector('button[aria-label="Mute sound"], button[aria-label="Enable sound"]');
  const sync = () => {
    const button = toggle();
    if (button) enabled = button.getAttribute('aria-pressed') === 'true';
    audio.muted = !enabled;
    if (enabled) start();
    else audio.pause();
  };
  const start = () => {
    if (enabled && audio.paused) audio.play().catch(() => {});
  };
  const retryOnGesture = (event) => {
    if (!enabled || (event.target instanceof Element && event.target.closest('button[aria-label*="sound"]'))) return;
    start();
    if (!audio.paused) {
      document.removeEventListener('pointerdown', retryOnGesture);
      document.removeEventListener('keydown', retryOnGesture);
    }
  };

  document.addEventListener('pointerdown', retryOnGesture, { passive: true });
  document.addEventListener('keydown', retryOnGesture);
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('button[aria-label*="sound"]')) {
      setTimeout(sync, 0);
    }
  });
  new MutationObserver(sync).observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'aria-pressed'],
  });
  start();
  sync();
})();
