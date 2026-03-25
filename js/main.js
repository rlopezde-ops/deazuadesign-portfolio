/* ==========================================================================
   Ricardo De Azua Portfolio - Interactions
   ========================================================================== */

/* --------------------------------------------------------------------------
   Feature Flags
   -------------------------------------------------------------------------- */
const FEATURE_FLAGS = {
  caseStudyPasswordProtection: false,  // Set to true when applying to re-enable password modals
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  initScrollAnimations();

  // Mobile full-screen nav (hamburger)
  initMobileNav();
  
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
  window.PASSWORD_PROTECTION_ENABLED = FEATURE_FLAGS.caseStudyPasswordProtection;
}

/* --------------------------------------------------------------------------
   Nav bar styles when scrolled (shared with mobile menu close so state stays correct)
   -------------------------------------------------------------------------- */
function syncNavScrollStyles(nav) {
  if (!nav) return;
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    nav.style.background = 'rgba(15, 15, 26, 1)';
    nav.style.backdropFilter = 'blur(10px)';
    nav.style.webkitBackdropFilter = 'blur(10px)';
    nav.style.boxShadow = '0 1px 0 rgba(181, 126, 220, 0.1)';
  } else {
    nav.style.background = '';
    nav.style.backdropFilter = '';
    nav.style.webkitBackdropFilter = '';
    nav.style.boxShadow = '';
  }
}

/* --------------------------------------------------------------------------
   Mobile navigation (hamburger + full-screen menu)
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');
  if (!nav || !toggle || !menu) return;

  const labelOpen = 'Open menu';
  const labelClose = 'Close menu';
  const mqMobile = window.matchMedia('(max-width: 768px)');

  function syncMenuAriaHidden() {
    if (!mqMobile.matches) {
      menu.removeAttribute('aria-hidden');
      return;
    }
    menu.setAttribute('aria-hidden', nav.classList.contains('nav--open') ? 'false' : 'true');
  }

  let closeTimer = null;

  function setOpen(open) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (open) {
      nav.classList.remove('nav--closing');
      nav.classList.add('nav--open');
      document.body.classList.add('nav-menu-open');
      /* WebKit: backdrop-filter on .nav creates a containing block for fixed children.
         Clear while menu is open so .nav-menu can cover the viewport; restore after close. */
      if (mqMobile.matches) {
        nav.style.backdropFilter = '';
        nav.style.webkitBackdropFilter = '';
      }
    } else {
      nav.classList.add('nav--closing');
      closeTimer = setTimeout(() => {
        nav.classList.remove('nav--open', 'nav--closing');
        document.body.classList.remove('nav-menu-open');
        syncNavScrollStyles(nav);
        syncMenuAriaHidden();
        closeTimer = null;
      }, 800);
    }

    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? labelClose : labelOpen);
    syncMenuAriaHidden();
  }

  function closeNav() {
    setOpen(false);
  }

  function onViewportChange() {
    if (!mqMobile.matches) {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      nav.classList.remove('nav--open', 'nav--closing');
      document.body.classList.remove('nav-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', labelOpen);
      syncNavScrollStyles(nav);
    }
    syncMenuAriaHidden();
  }

  syncMenuAriaHidden();
  if (typeof mqMobile.addEventListener === 'function') {
    mqMobile.addEventListener('change', onViewportChange);
  } else {
    mqMobile.addListener(onViewportChange);
  }

  toggle.addEventListener('click', () => {
    if (!mqMobile.matches) return;
    /* Re-open while closing: nav--open + nav--closing both set */
    const willOpen = !nav.classList.contains('nav--open') || nav.classList.contains('nav--closing');
    setOpen(willOpen);
    if (willOpen) {
      const first = menu.querySelector('.nav-links a');
      if (first) {
        window.requestAnimationFrame(() => first.focus());
      }
    } else {
      toggle.focus();
    }
  });

  menu.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => closeNav());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeNav();
      toggle.focus();
    }
  });
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
   Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // Add fade-in class to elements we want to animate
  const animatedSelectors = ['.case-card', '.expertise-item', '.about-text p'];
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

   IMPORTANT — Safari Dynamic Island:
   The nav background must ALWAYS be fully opaque (alpha = 1, not 0.95 or any
   fractional value). Safari on iPhone with viewport-fit=cover composites
   semi-transparent fixed elements differently in the Dynamic Island safe area,
   allowing page content to bleed through. When scrolled, use rgba(15,15,26,1).
   When at top, clear inline styles so the solid CSS background: var(--bg-primary)
   takes over. Never set a transparent or semi-transparent background here.
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    /* Avoid re-applying backdrop-filter while mobile menu is open (breaks fixed overlay). */
    if (nav.classList.contains('nav--open') || nav.classList.contains('nav--closing')) return;
    syncNavScrollStyles(nav);
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
   Hero Title Effects (Gradient shift + mouse-following glow on gradient text)
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
