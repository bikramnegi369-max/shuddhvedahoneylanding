import { initCountdown } from './countdown.js';
import { initProductsSlider } from './slider.js';

document.addEventListener('DOMContentLoaded', () => {
  // Launch target: 20 October 2026 IST
  initCountdown('2026-10-20T00:00:00+05:30');

  // Initialize Products Slider (draggable + autoplay on mobile, responsive grid on desktop)
  initProductsSlider();
});

