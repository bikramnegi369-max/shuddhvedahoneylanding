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

/**
 * Join Our Hive Form Client Handling
 * Validates Name, Mobile/WhatsApp, and Email fields,
 * provides smooth micro-interactions, disabled states,
 * and persists leads to local storage.
 */
export function initJoinHiveForm() {
  const form = document.getElementById('join-hive-form');
  const nameInput = document.getElementById('hive-name');
  const phoneInput = document.getElementById('hive-phone');
  const emailInput = document.getElementById('hive-email');
  const submitBtn = document.getElementById('join-hive-submit-btn');
  const feedback = document.getElementById('join-hive-feedback');

  if (!form || !nameInput || !phoneInput || !emailInput || !submitBtn || !feedback) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Allows international formatting, plus signs, spaces, hyphens, min 7 digits
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,6}$/;

  const inputs = [nameInput, phoneInput, emailInput];

  // Clear errors on input
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      if (feedback.classList.contains('is-error')) {
        feedback.textContent = '';
        feedback.className = 'join-hive-feedback';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    // Reset UI state
    inputs.forEach((input) => input.classList.remove('is-invalid'));
    feedback.textContent = '';
    feedback.className = 'join-hive-feedback';

    if (!name) {
      nameInput.classList.add('is-invalid');
      showFeedback('Please enter your full name.', 'is-error');
      nameInput.focus();
      return;
    }

    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      phoneInput.classList.add('is-invalid');
      showFeedback('Please enter a valid mobile or WhatsApp number.', 'is-error');
      phoneInput.focus();
      return;
    }

    if (!email || !emailRegex.test(email)) {
      emailInput.classList.add('is-invalid');
      showFeedback('Please enter a valid email address.', 'is-error');
      emailInput.focus();
      return;
    }

    // Submit state animation
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>RESERVING YOUR SPOT...</span>';

    setTimeout(() => {
      try {
        const hiveMembers = JSON.parse(localStorage.getItem('shuddhveda_hive_members') || '[]');
        hiveMembers.push({
          name,
          phone,
          email,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('shuddhveda_hive_members', JSON.stringify(hiveMembers));
      } catch (err) {
        console.warn('LocalStorage unavailable:', err);
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showFeedback('🍯 Welcome to the hive! You’ll be the first to taste our 6 honey varieties.', 'is-success');
    }, 700);
  });

  function showFeedback(msg, statusClass) {
    feedback.textContent = msg;
    feedback.className = `join-hive-feedback is-visible ${statusClass}`;
  }
}

