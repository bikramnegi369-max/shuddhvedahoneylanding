/**
 * countdown.js - Urgency / limited batch countdown timer module
 */
export function initCountdown(targetDate, elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;

  function update() {
    const diff = targetDate.getTime() - new Date().getTime();
    if (diff <= 0) {
      container.innerHTML = "<span>Fresh Harvest Available Now!</span>";
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    container.innerHTML = `
      <div class="timer-box"><strong>${hours}</strong>h</div>
      <div class="timer-box"><strong>${minutes}</strong>m</div>
      <div class="timer-box"><strong>${seconds}</strong>s</div>
    `;
  }

  update();
  setInterval(update, 1000);
}
