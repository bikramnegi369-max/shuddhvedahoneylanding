const API_SUBMIT_URL = 'https://sltwdpp8-3000.inc1.devtunnels.ms/api/subscribe/submit';

/**
 * Shared API Helper for subscribing
 * @param {{ name?: string, email: string, mobile?: string }} payload
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function submitSubscription(payload) {
  const response = await fetch(API_SUBMIT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Subscription failed (Status ${response.status}). Please try again.`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Subscribe Form Client Handling (Launch Access / VIP / Coming Soon Section)
 * Finds ALL .subscribe-form instances on the page and handles asynchronous
 * submissions without page reload.
 * Submits { email } to the subscription API.
 */
export function initSubscribeForm() {
  const forms = document.querySelectorAll('.subscribe-form');
  if (!forms || forms.length === 0) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach((form) => {
    const input = form.querySelector('.subscribe-input');
    const submitBtn = form.querySelector('.subscribe-submit');
    const feedback = form.querySelector('.subscribe-feedback');

    if (!input || !submitBtn || !feedback) return;

    form.addEventListener('submit', async (e) => {
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

      // Set loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>RESERVING...</span>';

      try {
        await submitSubscription({ email });

        // Save locally as backup / lead capturing
        try {
          const subscribers = JSON.parse(localStorage.getItem('shuddhveda_subscribers') || '[]');
          if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('shuddhveda_subscribers', JSON.stringify(subscribers));
          }
        } catch (storageErr) {
          console.warn('LocalStorage unavailable:', storageErr);
        }

        input.value = '';
        showFeedback('✨ You’re on the VIP list! Exclusive access details will be sent to your inbox.', 'is-success');
      } catch (err) {
        console.error('Subscription error:', err);
        showFeedback(err.message || 'Unable to submit right now. Please try again.', 'is-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
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
  });
}

/**
 * Join Our Hive Form Client Handling
 * Submits { name, email, mobile } to the subscription API.
 * Name and Mobile are optional; Email is required.
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
  // Allows international formatting, plus signs, spaces, hyphens, min 7 digits if provided
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    // Reset UI state
    inputs.forEach((input) => input.classList.remove('is-invalid'));
    feedback.textContent = '';
    feedback.className = 'join-hive-feedback';

    // Email is required
    if (!email) {
      emailInput.classList.add('is-invalid');
      showFeedback('Please enter your email address.', 'is-error');
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      emailInput.classList.add('is-invalid');
      showFeedback('Please enter a valid email address.', 'is-error');
      emailInput.focus();
      return;
    }

    // Phone is optional, but if entered validate format
    if (phone && !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      phoneInput.classList.add('is-invalid');
      showFeedback('Please enter a valid mobile or WhatsApp number.', 'is-error');
      phoneInput.focus();
      return;
    }

    // Build payload matching API specification
    const payload = { email };
    if (name) payload.name = name;
    if (phone) payload.mobile = phone;

    // Submit state animation
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>RESERVING YOUR SPOT...</span>';

    try {
      await submitSubscription(payload);

      try {
        const hiveMembers = JSON.parse(localStorage.getItem('shuddhveda_hive_members') || '[]');
        hiveMembers.push({
          ...payload,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('shuddhveda_hive_members', JSON.stringify(hiveMembers));
      } catch (storageErr) {
        console.warn('LocalStorage unavailable:', storageErr);
      }

      form.reset();
      showFeedback('🍯 Welcome to the hive! You’ll be the first to taste our 6 honey varieties.', 'is-success');
    } catch (err) {
      console.error('Join Hive subscription error:', err);
      showFeedback(err.message || 'Unable to reserve your spot right now. Please try again.', 'is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function showFeedback(msg, statusClass) {
    feedback.textContent = msg;
    feedback.className = `join-hive-feedback is-visible ${statusClass}`;
  }
}


