/* ============================================
   NEW CULT FILMS — Home Page JS
   ============================================ */

// ── Custom cursor ──────────────────────────
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', e => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
  gsap.to(ring,   { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power2.out' });
});

// ── Entrance animation timeline ───────────
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl
  // 1. Linha draws in from left
  .to('.linha', {
    opacity: 1,
    scaleX: 1,
    duration: 1.6,
    ease: 'expo.inOut',
    transformOrigin: 'left center',
    delay: 0.3
  })
  .fromTo('.linha', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.3)
  .to('.linha', { opacity: 1, duration: 0 }, 0.3)

  // 2. Logo fades + rises
  .fromTo('.logo-wrap', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 
    1.4
  )

  // 3. Logo gets floating class
  .add(() => document.querySelector('.logo-hero').classList.add('logo-float'), 2.8)

  // 4. Scroll hint fades in
  .to('.scroll-hint', { opacity: 1, duration: 1, ease: 'power2.out' }, 2.4);


// ── ScrollTrigger — second fold ───────────
gsap.registerPlugin(ScrollTrigger);

// Aguardem block
gsap.to('.aguardem-block', {
  opacity: 1,
  y: 0,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.second-fold',
    start: 'top 75%',
    toggleActions: 'play none none none'
  }
});

// Golden line reveal (parallax-line)
ScrollTrigger.create({
  trigger: '.second-fold',
  start: 'top 80%',
  onEnter: () => {
    const line = document.getElementById('fold2-line');
    if (line) line.classList.add('visible');
  }
});

// Corner label
gsap.to('.fold-label', {
  opacity: 1,
  duration: 1.4,
  delay: 0.3,
  scrollTrigger: {
    trigger: '.second-fold',
    start: 'top 70%',
    toggleActions: 'play none none none'
  }
});

// Footer strip
gsap.to('.home-footer', {
  opacity: 1,
  duration: 1.2,
  scrollTrigger: {
    trigger: '.second-fold',
    start: 'top 50%',
    toggleActions: 'play none none none'
  }
});

// ── Efeito de escala na dobra 2 ao scroll ──────────────────────
// O Aguardem cresce suavemente de 0.88 → 1 conforme entra na tela
gsap.fromTo('.aguardem-block',
  { scale: 0.88 },
  {
    scale: 1,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.second-fold',
      start: 'top 85%',
      end: 'top 30%',
      scrub: 1
    }
  }
);

// Leve fade-in do fundo da segunda dobra (spotlight amarelo sutil)
gsap.fromTo('#second-fold',
  { backgroundImage: 'radial-gradient(ellipse at center, rgba(232,184,0,0) 0%, transparent 100%)' },
  {
    backgroundImage: 'radial-gradient(ellipse at center, rgba(232,184,0,0.04) 0%, transparent 70%)',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.second-fold',
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  }
);


// ── Subtle parallax on scroll ─────────────
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const logoWrap = document.querySelector('.logo-wrap');
  if (logoWrap) {
    // Slow the logo down vs the scroll — cinematic parallax
    gsap.to(logoWrap, {
      y: y * 0.12,
      duration: 0.6,
      ease: 'power1.out',
      overwrite: true
    });
  }
  const linhaWrap = document.querySelector('.linha-wrap');
  if (linhaWrap) {
    gsap.to(linhaWrap, {
      y: y * 0.06,
      duration: 0.6,
      ease: 'power1.out',
      overwrite: true
    });
  }
});
