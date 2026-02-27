/* ==========================================================================
   Ricardo De Azua Portfolio - Interactions
   ========================================================================== */

/* --------------------------------------------------------------------------
   Feature Flags
   -------------------------------------------------------------------------- */
const FEATURE_FLAGS = {
  testimonialSection: false  // Set to true when ready with new quotes and design
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize custom cursor
  initCustomCursor();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize smooth scroll for nav links
  initSmoothScroll();
  
  // Initialize card hover effects
  initCardEffects();
  
  // Initialize nav background on scroll
  initNavScroll();
  
  // Initialize hero title interactions (gradient shift)
  initHeroTitleEffects();
  
  // Initialize hero floating icons (scroll opacity + cursor parallax)
  initHeroFloatingIcons();
  
  // Initialize password visibility toggle (for protected case studies)
  initPasswordToggle();
  
  // Apply feature flags
  applyFeatureFlags();
});

function applyFeatureFlags() {
  if (!FEATURE_FLAGS.testimonialSection) {
    const testimonial = document.getElementById('homepage-testimonial');
    if (testimonial) testimonial.style.display = 'none';
  }
}

/* --------------------------------------------------------------------------
   Password Visibility Toggle (WCAG-compliant)
   -------------------------------------------------------------------------- */
function initPasswordToggle() {
  const toggle = document.getElementById('passwordToggle');
  const input = document.getElementById('passwordInput');
  const statusEl = document.getElementById('passwordStatus');
  const form = document.getElementById('passwordForm');

  if (!toggle || !input || !form) return;

  const iconEl = toggle.querySelector('i');
  if (!iconEl) return;

  toggle.addEventListener('click', () => {
    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    toggle.setAttribute('aria-pressed', !isVisible);
    toggle.setAttribute('title', isVisible ? 'Show password' : 'Hide password');
    iconEl.className = isVisible ? 'iconoir-eye' : 'iconoir-eye-closed';
    iconEl.setAttribute('aria-hidden', 'true');

    if (statusEl) {
      statusEl.textContent = isVisible ? 'Your password is hidden.' : 'Your password is shown.';
    }
  });

  form.addEventListener('submit', () => {
    if (input.type === 'text') {
      input.type = 'password';
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('title', 'Show password');
      iconEl.className = 'iconoir-eye';
    }
  }, true);
}

/* --------------------------------------------------------------------------
   Custom Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Only init on devices with fine pointer (mouse) and no reduced motion preference
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  
  if (!dot || !outline) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });
  
  // Smooth outline follow with lerp
  function animateOutline() {
    // Lerp factor - lower = smoother/slower
    const ease = 0.15;
    
    outlineX += (mouseX - outlineX) * ease;
    outlineY += (mouseY - outlineY) * ease;
    
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();
  
  // Hover effects on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .case-card, .video-card, .connect-link, .expertise-item');
  const textHoverTargets = document.querySelectorAll('.gradient-text-wrapper');
  
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      outline.classList.add('cursor-hover-link');
    });
    target.addEventListener('mouseleave', () => {
      outline.classList.remove('cursor-hover-link');
    });
  });
  
  textHoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      outline.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      outline.classList.remove('cursor-hover');
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // Add fade-in class to elements we want to animate
  const testimonialSelector = FEATURE_FLAGS.testimonialSection ? '.testimonial' : '';
  const animatedSelectors = ['.case-card', '.expertise-item', '.about-text p'].filter(Boolean);
  if (testimonialSelector) animatedSelectors.push(testimonialSelector);
  const animatedElements = document.querySelectorAll(animatedSelectors.join(', '));
  
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
  });
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Card Hover Effects
   -------------------------------------------------------------------------- */
function initCardEffects() {
  const cards = document.querySelectorAll('.case-card');
  
  cards.forEach(card => {
    // Add subtle parallax effect on mouse move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateY(-8px)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   Navigation Scroll Effect
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background when scrolled
    if (currentScroll > 100) {
      nav.style.background = 'rgba(15, 15, 26, 0.95)';
      nav.style.backdropFilter = 'blur(10px)';
      nav.style.boxShadow = '0 1px 0 rgba(181, 126, 220, 0.1)';
    } else {
      nav.style.background = 'linear-gradient(180deg, rgba(15, 15, 26, 1) 0%, transparent 100%)';
      nav.style.backdropFilter = 'none';
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

/* --------------------------------------------------------------------------
   Utility: Debounce
   -------------------------------------------------------------------------- */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* --------------------------------------------------------------------------
   Hero Title Effects (Gradient Shift + Cursor Glow)
   -------------------------------------------------------------------------- */
function initHeroTitleEffects() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  const wrapper = document.querySelector('.gradient-text-wrapper');
  const gradientText = document.querySelector('.gradient-text');
  const cursorGlow = document.querySelector('.hero-cursor-glow');
  
  if (!wrapper || !gradientText || !cursorGlow) return;
  
  // Handle mouse move - update glow position and gradient
  function handleMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();
    
    // Position the cursor glow
    const glowX = e.clientX - rect.left;
    const glowY = e.clientY - rect.top;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    
    // Update gradient position based on mouse
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Wider gradient shift range (10% to 90%)
    const gradientX = 10 + (x / 100) * 80;
    const gradientY = 10 + (y / 100) * 80;
    
    gradientText.style.setProperty('--gradient-pos-x', `${gradientX}%`);
    gradientText.style.setProperty('--gradient-pos-y', `${gradientY}%`);
  }
  
  // Mouse enter - initialize glow position
  function handleMouseEnter(e) {
    const rect = wrapper.getBoundingClientRect();
    cursorGlow.style.left = `${e.clientX - rect.left}px`;
    cursorGlow.style.top = `${e.clientY - rect.top}px`;
  }
  
  // Mouse leave - reset gradient
  function handleMouseLeave() {
    gradientText.style.setProperty('--gradient-pos-x', '50%');
    gradientText.style.setProperty('--gradient-pos-y', '50%');
  }
  
  wrapper.addEventListener('mouseenter', handleMouseEnter);
  wrapper.addEventListener('mouseleave', handleMouseLeave);
  wrapper.addEventListener('mousemove', handleMouseMove);
}

/* --------------------------------------------------------------------------
   Hero Floating Icons (Scroll Opacity + Cursor Parallax)
   -------------------------------------------------------------------------- */
function initHeroFloatingIcons() {
  const hero = document.querySelector('.hero');
  const iconsContainer = document.querySelector('.hero-floating-icons');

  if (!hero || !iconsContainer) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CURSOR_PX_MAX = 6;
  const LERP_EASE = 0.08;

  let mouseX = 0;
  let cursorShiftX = 0;
  let rafId = null;

  function tick() {
    const rect = hero.getBoundingClientRect();
    const scrollProgress = Math.max(0, -rect.top / rect.height);
    const opacity = 0.25 + Math.min(1, scrollProgress / 0.33) * 0.20;
    hero.style.setProperty('--hero-icons-opacity', String(opacity));

    if (hasFinePointer) {
      cursorShiftX += (mouseX - cursorShiftX) * LERP_EASE;
      hero.style.setProperty('--cursor-shift-x', `${cursorShiftX}px`);
    }

    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  if (hasFinePointer) {
    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const normalized = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      mouseX = normalized * CURSOR_PX_MAX;
    });
  }

  rafId = requestAnimationFrame(tick);
}
