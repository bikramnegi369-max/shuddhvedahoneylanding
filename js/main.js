import { initCountdown } from './countdown.js';
import { initProductsSlider, initHoneyPickSlider } from './slider.js';
import { initSubscribeForm, initJoinHiveForm } from './subscribe.js';

document.addEventListener('DOMContentLoaded', () => {
  // Launch target: 20 October 2026 IST
  initCountdown('2026-10-20T00:00:00+05:30');

  // Initialize Products Slider (draggable + autoplay on mobile, responsive grid on desktop)
  initProductsSlider();

  // Initialize Honey Pick Slider (draggable + autoplay on mobile, 6-col showcase on desktop)
  initHoneyPickSlider();

  // Initialize Subscribe / Launch Access Form
  initSubscribeForm();

  // Initialize Join Our Hive Form
  initJoinHiveForm();
});

