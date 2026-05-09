const typedEl = document.getElementById('typed-text');
let roles = window.i18n ? window.i18n.t('roles') : ['Software Developer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer = null;

function typeEffect() {
  const currentRole = roles[roleIndex];
  const cursor = '<span class="cursor"></span>';

  if (!isDeleting) {
    // Efecto de escritura
    typedEl.innerHTML = currentRole.slice(0, charIndex++) + cursor;

    if (charIndex > currentRole.length) {
      isDeleting = true;
      typingTimer = setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    // Efecto de borrado
    typedEl.innerHTML = currentRole.slice(0, charIndex--) + cursor;

    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  typingTimer = setTimeout(typeEffect, isDeleting ? 60 : 120);
}

// Se reinicia el typing cuando se cambia el idioma
document.addEventListener('langChanged', (e) => {
  clearTimeout(typingTimer);
  roles = e.detail.roles;
  roleIndex = 0;
  charIndex = 0;
  isDeleting = false;
  if (typedEl) typeEffect();
});

if (typedEl) typeEffect();


// ── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // Animar barras de habilidades 
      entry.target.querySelectorAll('.skill-item__fill').forEach((bar) => {
        bar.style.width = bar.dataset.width + '%';
      });

      // Dejar de observar
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


// ── HIGHLIGHT DE NAV AL HACER SCROLL ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

function updateNavHighlight() {
  let currentId = '';

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentId}`
    );
  });


window.addEventListener('scroll', updateNavHighlight, { passive: true });
updateNavHighlight(); 


// ── SMOOTH SCROLL para links de nav ──
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


// ── FORMULARIO DE CONTACTO ───
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn--submit');
    const original = btn.textContent;
    const lang = window.i18n ? window.i18n.getCurrentLang() : 'es';
    btn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/mnjwzvjd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (res.ok) {
        btn.textContent = lang === 'es' ? '¡Mensaje enviado! ✓' : 'Message sent! ✓';
        form.reset();
      } else throw new Error();
      
    } catch {
      btn.textContent = lang === 'es' ? 'Error — intenta de nuevo' : 'Error - please retry';
      btn.disabled = false;
    }

    // Restaurar botón después de 3 segundos
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled    = false;
    }, 3000);
  });
}
