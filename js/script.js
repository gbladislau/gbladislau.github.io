const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

document.querySelectorAll('.panel, .editorial-band, .closing-strip').forEach((element) => {
  observer.observe(element);
});

const infoChip = document.querySelector('.info-chip');
const infoPopup = document.querySelector('.info-popup');

if (infoChip && infoPopup) {
  const toggleInfoPopup = () => {
    const isVisible = infoPopup.classList.toggle('is-visible');

    infoChip.setAttribute('aria-expanded', String(isVisible));
    infoPopup.setAttribute('aria-hidden', String(!isVisible));
  };

  const closeInfoPopup = () => {
    infoPopup.classList.remove('is-visible');
    infoChip.setAttribute('aria-expanded', 'false');
    infoPopup.setAttribute('aria-hidden', 'true');
  };

  infoChip.addEventListener('click', toggleInfoPopup);

  document.addEventListener('click', (event) => {
    if (!infoPopup.classList.contains('is-visible')) {
      return;
    }

    if (event.target instanceof Node && !infoChip.contains(event.target) && !infoPopup.contains(event.target)) {
      closeInfoPopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeInfoPopup();
    }
  });
}
