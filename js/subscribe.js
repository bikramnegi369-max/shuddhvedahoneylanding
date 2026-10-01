/**
 * Subscribe Form Client Handling
 * Provides accessible, immediate client-side validation, loading feedback,
 * and persistent storage of VIP launch notification signups.
 */

export function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  const input = document.getElementById('subscribe-email');
  const submitBtn = document.getElementById('subscribe-submit-btn');
  const feedback = document.getElementById('subscribe-feedback');

  if (!form || !input || !submitBtn || !feedback) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    // Reset feedback
    feedback.textContent = '';
    feedback.className = 'subscribe-feedback';

    if (!email) {
      showFeedback('Please enter your email address.', 'is-error');
      input.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'is-error');
      input.focus();
      return;
    }

    // Simulate submission state with accessible UI feedback
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>RESERVING...</span>';

    setTimeout(() => {
      // Store in localStorage for demonstration/lead capturing
      try {
        const subscribers = JSON.parse(localStorage.getItem('shuddhveda_subscribers') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('shuddhveda_subscribers', JSON.stringify(subscribers));
        }
      } catch (err) {
        // Safe failover if storage is disabled
        console.warn('LocalStorage unavailable:', err);
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      input.value = '';
      showFeedback('✨ You’re on the VIP list! Exclusive access details will be sent to your inbox.', 'is-success');
    }, 700);
  });

  // Clear validation error on typing
  input.addEventListener('input', () => {
    if (feedback.classList.contains('is-error')) {
      feedback.textContent = '';
      feedback.className = 'subscribe-feedback';
    }
  });

  function showFeedback(msg, statusClass) {
    feedback.textContent = msg;
    feedback.className = `subscribe-feedback ${statusClass}`;
  }
}
