// ── EFECTO DE ESCRITURA (Typing)
const ROLES = [
  'Software Developer',
  'Full-Stack Web Developer',
  'JavaScript Enthusiast',
  'Python Developer',
  'Database & API Developer',
  'Backend Developer',
];

const typedEl  = document.getElementById('typed-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = ROLES[roleIndex];
  const cursor      = '<span class="cursor"></span>';

  if (!isDeleting) {
    // Efecto de escritura
    typedEl.innerHTML = currentRole.slice(0, charIndex++) + cursor;

    if (charIndex > currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    // Efecto de borrado
    typedEl.innerHTML = currentRole.slice(0, charIndex--) + cursor;

    if (charIndex < 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % ROLES.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 60 : 120);
}

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
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a');

function updateNavHighlight() {
  let currentId = '';

  sections.forEach((section) => {
    const offsetTop = section.offsetTop - 120;
    if (window.scrollY >= offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentId}`
    );
  });
}

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

    const btn      = form.querySelector('.btn--submit');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled    = true;

    try {
      const res = await fetch('https://formspree.io/f/mnjwzvjd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (res.ok) {
        btn.textContent = '¡Mensaje enviado! ✓';
        form.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch {
      btn.textContent  = 'Error — intenta de nuevo';
      btn.disabled     = false;
    }

    // Restaurar botón después de 3 segundos
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled    = false;
    }, 3000);
  });
}
