/**
 * faq.js - Accessible accordion toggling
 */
export function initFaqAccordion(selector = '.faq-item') {
  const items = document.querySelectorAll(selector);
  items.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(other => other.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}
