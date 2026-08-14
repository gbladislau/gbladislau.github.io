const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initializeAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.hash.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      window.history.pushState(null, '', link.hash);
    });
  });
}

function initializeScrollReveals() {
  const revealElements = document.querySelectorAll('.panel, .editorial-band, .closing-strip');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initializeInfoPopup() {
  const infoChip = document.querySelector('.info-chip');
  const infoPopup = document.querySelector('.info-popup');

  if (!infoChip || !infoPopup) {
    return;
  }

  const setPopupVisibility = (isVisible) => {
    infoPopup.classList.toggle('is-visible', isVisible);
    infoChip.setAttribute('aria-expanded', String(isVisible));
    infoPopup.setAttribute('aria-hidden', String(!isVisible));
  };

  infoChip.addEventListener('click', () => {
    setPopupVisibility(infoChip.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('click', (event) => {
    const eventPath = event.composedPath();
    const clickedOutsidePopup = !eventPath.includes(infoPopup) && !eventPath.includes(infoChip);

    if (infoChip.getAttribute('aria-expanded') === 'true' && clickedOutsidePopup) {
      setPopupVisibility(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && infoChip.getAttribute('aria-expanded') === 'true') {
      setPopupVisibility(false);
      infoChip.focus();
    }
  });
}

initializeAnchorNavigation();
initializeScrollReveals();
initializeInfoPopup();
