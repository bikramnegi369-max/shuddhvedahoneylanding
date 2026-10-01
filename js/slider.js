/**
 * Products Section Carousel Logic
 * Seamless Infinite Looping Carousel:
 * Uses clone nodes (last clone prepended, first clone appended) with zero-transition teleportation.
 * Supports smooth touch/mouse dragging, threshold snaps, continuous autoplay, and pagination dots.
 */
export function initProductsSlider() {
  const wrapper = document.getElementById('products-slider-wrapper');
  const track = document.getElementById('products-track');
  if (!track) return;

  const originalCards = Array.from(track.querySelectorAll('.product-card:not([data-clone])'));
  const dots = Array.from(document.querySelectorAll('.pagination-dot'));
  const totalRealCards = originalCards.length;
  if (totalRealCards === 0) return;

  // Clone management for seamless infinite wrap
  track.querySelectorAll('[data-clone]').forEach(el => el.remove());

  // Prepend clone of last card, append clone of first card
  const firstClone = originalCards[0].cloneNode(true);
  const lastClone = originalCards[totalRealCards - 1].cloneNode(true);
  firstClone.setAttribute('data-clone', 'first');
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('data-clone', 'last');
  lastClone.setAttribute('aria-hidden', 'true');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  // All cards including clones: [lastClone (0), Real0 (1), Real1 (2), ..., Real5 (6), firstClone (7)]
  let allCards = Array.from(track.querySelectorAll('.product-card'));

  // Initial active card: Mustard Honey (Real 1 -> index 2 in allCards)
  let currentIndex = 2;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isTransitioning = false;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 3500;

  const isMobile = () => window.innerWidth < 992;

  // Calculates track translation (px) to center allCards[index] in mobile viewport
  function getPositionForIndex(index) {
    if (!isMobile()) return 0;
    const card = allCards[index];
    if (!card) return 0;
    const cardWidth = card.offsetWidth;
    const cardOffsetLeft = card.offsetLeft;
    const windowWidth = window.innerWidth;
    return (windowWidth / 2) - (cardOffsetLeft + (cardWidth / 2));
  }

  function setSliderPosition() {
    if (isMobile()) {
      track.style.transform = `translateX(${currentTranslate}px)`;
    } else {
      track.style.transform = '';
    }
  }

  function getRealIndex(index) {
    if (index === 0) return totalRealCards - 1;
    if (index === allCards.length - 1) return 0;
    return index - 1;
  }

  function updateActiveVisuals() {
    const activeRealIndex = getRealIndex(currentIndex);

    allCards.forEach((card, idx) => {
      // Synchronize both real card and its corresponding clone so both stay scaled properly
      const isCardActive = (idx === currentIndex) ||
                           (currentIndex === allCards.length - 1 && idx === 1) ||
                           (currentIndex === 0 && idx === allCards.length - 2);

      if (isCardActive) {
        card.classList.add('is-active');
        if (!card.hasAttribute('data-clone')) {
          card.setAttribute('aria-current', 'true');
        }
      } else {
        card.classList.remove('is-active');
        card.removeAttribute('aria-current');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === activeRealIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index, animate = true) {
    if (!isMobile()) {
      updateActiveVisuals();
      return;
    }

    currentIndex = index;
    updateActiveVisuals();

    if (animate) {
      isTransitioning = true;
      track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      isTransitioning = false;
      track.style.transition = 'none';
    }

    currentTranslate = getPositionForIndex(currentIndex);
    prevTranslate = currentTranslate;
    setSliderPosition();
  }

  // Handle transition end for seamless infinite teleportation
  track.addEventListener('transitionend', (e) => {
    // Only handle transform transition of track itself, ignore bubbled card transitions
    if (e.target !== track || e.propertyName !== 'transform') return;

    isTransitioning = false;
    if (!isMobile()) return;

    // Temporarily suppress card CSS transitions during DOM coordinate teleportation to prevent flicker
    const suppressCardTransitions = () => {
      allCards.forEach(c => c.style.transition = 'none');
    };
    const restoreCardTransitions = () => {
      // Force style reflow then restore
      void track.offsetHeight;
      allCards.forEach(c => c.style.transition = '');
    };

    // If reached firstClone (at the very end), silently snap back to real first card (index 1)
    if (currentIndex === allCards.length - 1) {
      suppressCardTransitions();
      track.style.transition = 'none';
      currentIndex = 1;
      currentTranslate = getPositionForIndex(currentIndex);
      prevTranslate = currentTranslate;
      setSliderPosition();
      updateActiveVisuals();
      restoreCardTransitions();
    }
    // If reached lastClone (at the very start), silently snap forward to real last card
    else if (currentIndex === 0) {
      suppressCardTransitions();
      track.style.transition = 'none';
      currentIndex = allCards.length - 2;
      currentTranslate = getPositionForIndex(currentIndex);
      prevTranslate = currentTranslate;
      setSliderPosition();
      updateActiveVisuals();
      restoreCardTransitions();
    }
  });

  // Touch and pointer dragging
  function getPointerX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function onPointerDown(e) {
    if (!isMobile()) return;
    isDragging = true;
    startX = getPointerX(e);
    stopAutoplay();

    track.classList.add('is-dragging');
    track.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging || !isMobile()) return;
    const currentX = getPointerX(e);
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    setSliderPosition();
  }

  function onPointerUp(e) {
    if (!isDragging || !isMobile()) return;
    isDragging = false;
    track.classList.remove('is-dragging');

    const movedBy = currentTranslate - prevTranslate;

    // If moved by more than 10px, treat as drag and prevent accidental card clicks
    if (Math.abs(movedBy) > 10) {
      allCards.forEach(c => c.dataset.preventClick = 'true');
      setTimeout(() => {
        allCards.forEach(c => c.removeAttribute('data-prevent-click'));
      }, 200);
    }

    // Swipe left (next)
    if (movedBy < -45) {
      goToSlide(currentIndex + 1, true);
    }
    // Swipe right (prev)
    else if (movedBy > 45) {
      goToSlide(currentIndex - 1, true);
    }
    // Snap back to current
    else {
      goToSlide(currentIndex, true);
    }

    startAutoplay();
  }

  // Autoplay functionality
  function startAutoplay() {
    stopAutoplay();
    if (!isMobile()) return;
    autoplayTimer = setInterval(() => {
      if (!isDragging && !isTransitioning) {
        goToSlide(currentIndex + 1, true);
      }
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Event bindings
  track.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  track.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', () => {
    if (isMobile()) startAutoplay();
  });

  // Prevent navigation when user was dragging the carousel
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card && card.dataset.preventClick === 'true') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Pagination click
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const realIndex = parseInt(e.currentTarget.getAttribute('data-dot'), 10);
      if (!isNaN(realIndex)) {
        goToSlide(realIndex + 1, true);
        startAutoplay();
      }
    });
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    if (isMobile()) {
      goToSlide(currentIndex, false);
      startAutoplay();
    } else {
      stopAutoplay();
      track.style.transform = '';
      track.style.transition = '';
      allCards.forEach(c => c.classList.remove('is-active'));
    }
  });

  // Initial layout calculation
  if (isMobile()) {
    setTimeout(() => {
      goToSlide(currentIndex, false);
      startAutoplay();
    }, 60);
  } else {
    originalCards.forEach((card, idx) => {
      if (idx === 1) card.classList.add('is-active');
    });
  }
}
