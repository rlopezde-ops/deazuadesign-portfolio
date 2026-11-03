/* ==========================================================================
   Ricardo De Azua Portfolio - Interactions
   Ported from js/main.js and the case study inline scripts. Internal links are
   plain <a> tags, so every page is a full load and this runs once per page.
   ========================================================================== */

let initialized = false;

export function initSiteEffects() {
  if (initialized) return;
  initialized = true;

  initScrollAnimations();
  initFadeInSections();
  initMobileNav();
  initSmoothScroll();
  initCardEffects();
  initNavScroll();
  initHeroTitleEffects();
  initHeroFloatingIcons();
  initVideoModal();
}

/* --------------------------------------------------------------------------
   Nav bar styles when scrolled (shared with mobile menu close so state stays correct)
   -------------------------------------------------------------------------- */
function syncNavScrollStyles(nav: HTMLElement) {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    nav.style.background = "rgba(15, 15, 26, 1)";
    nav.style.backdropFilter = "blur(10px)";
    nav.style.setProperty("-webkit-backdrop-filter", "blur(10px)");
    nav.style.boxShadow = "0 1px 0 rgba(181, 126, 220, 0.1)";
  } else {
    nav.style.background = "";
    nav.style.backdropFilter = "";
    nav.style.setProperty("-webkit-backdrop-filter", "");
    nav.style.boxShadow = "";
  }
}

/* --------------------------------------------------------------------------
   Mobile navigation (hamburger + full-screen menu)
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const nav = document.querySelector<HTMLElement>(".nav");
  const toggle = document.querySelector<HTMLElement>(".nav-toggle");
  const menu = document.getElementById("primary-nav");
  if (!nav || !toggle || !menu) return;

  const labelOpen = "Open menu";
  const labelClose = "Close menu";
  const mqMobile = window.matchMedia("(max-width: 768px)");

  function syncMenuAriaHidden() {
    if (!mqMobile.matches) {
      menu!.removeAttribute("aria-hidden");
      return;
    }
    menu!.setAttribute("aria-hidden", nav!.classList.contains("nav--open") ? "false" : "true");
  }

  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  function setOpen(open: boolean) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (open) {
      nav!.classList.remove("nav--closing");
      nav!.classList.add("nav--open");
      document.body.classList.add("nav-menu-open");
      /* WebKit: backdrop-filter on .nav creates a containing block for fixed children.
         Clear while menu is open so .nav-menu can cover the viewport; restore after close. */
      if (mqMobile.matches) {
        nav!.style.backdropFilter = "";
        nav!.style.setProperty("-webkit-backdrop-filter", "");
      }
    } else {
      nav!.classList.add("nav--closing");
      closeTimer = setTimeout(() => {
        nav!.classList.remove("nav--open", "nav--closing");
        document.body.classList.remove("nav-menu-open");
        syncNavScrollStyles(nav!);
        syncMenuAriaHidden();
        closeTimer = null;
      }, 800);
    }

    toggle!.setAttribute("aria-expanded", open ? "true" : "false");
    toggle!.setAttribute("aria-label", open ? labelClose : labelOpen);
    syncMenuAriaHidden();
  }

  function onViewportChange() {
    if (!mqMobile.matches) {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      nav!.classList.remove("nav--open", "nav--closing");
      document.body.classList.remove("nav-menu-open");
      toggle!.setAttribute("aria-expanded", "false");
      toggle!.setAttribute("aria-label", labelOpen);
      syncNavScrollStyles(nav!);
    }
    syncMenuAriaHidden();
  }

  syncMenuAriaHidden();
  mqMobile.addEventListener("change", onViewportChange);

  toggle.addEventListener("click", () => {
    if (!mqMobile.matches) return;
    /* Re-open while closing: nav--open + nav--closing both set */
    const willOpen = !nav.classList.contains("nav--open") || nav.classList.contains("nav--closing");
    setOpen(willOpen);
    if (willOpen) {
      const first = menu.querySelector<HTMLElement>(".nav-links a");
      if (first) {
        window.requestAnimationFrame(() => first.focus());
      }
    } else {
      toggle.focus();
    }
  });

  menu.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav--open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   Scroll Animations
   -------------------------------------------------------------------------- */
function observeVisible(selector: string) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}

function initScrollAnimations() {
  observeVisible(".fade-in");
}

function initFadeInSections() {
  observeVisible(".fade-in-section");
}

/* --------------------------------------------------------------------------
   Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Card Hover Effects
   -------------------------------------------------------------------------- */
function initCardEffects() {
  document.querySelectorAll<HTMLElement>(".case-card").forEach((card) => {
    // Add subtle parallax effect on mouse move
    card.addEventListener("mousemove", (e) => {
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

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
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
  const nav = document.querySelector<HTMLElement>(".nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    /* Avoid re-applying backdrop-filter while mobile menu is open (breaks fixed overlay). */
    if (nav.classList.contains("nav--open") || nav.classList.contains("nav--closing")) return;
    syncNavScrollStyles(nav);
  });
}

/* --------------------------------------------------------------------------
   Hero Title Effects (Gradient shift + mouse-following glow on gradient text)
   -------------------------------------------------------------------------- */
function initHeroTitleEffects() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const wrapper = document.querySelector<HTMLElement>(".gradient-text-wrapper");
  const gradientText = document.querySelector<HTMLElement>(".gradient-text");
  const cursorGlow = document.querySelector<HTMLElement>(".hero-cursor-glow");

  if (!wrapper || !gradientText || !cursorGlow) return;

  // Handle mouse move - update glow position and gradient
  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();

    // Position the cursor glow
    cursorGlow.style.left = `${e.clientX - rect.left}px`;
    cursorGlow.style.top = `${e.clientY - rect.top}px`;

    // Update gradient position based on mouse
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Wider gradient shift range (10% to 90%)
    const gradientX = 10 + (x / 100) * 80;
    const gradientY = 10 + (y / 100) * 80;

    gradientText.style.setProperty("--gradient-pos-x", `${gradientX}%`);
    gradientText.style.setProperty("--gradient-pos-y", `${gradientY}%`);
  });

  // Mouse enter - initialize glow position
  wrapper.addEventListener("mouseenter", (e) => {
    const rect = wrapper.getBoundingClientRect();
    cursorGlow.style.left = `${e.clientX - rect.left}px`;
    cursorGlow.style.top = `${e.clientY - rect.top}px`;
  });

  // Mouse leave - reset gradient
  wrapper.addEventListener("mouseleave", () => {
    gradientText.style.setProperty("--gradient-pos-x", "50%");
    gradientText.style.setProperty("--gradient-pos-y", "50%");
  });
}

/* --------------------------------------------------------------------------
   Hero Floating Icons (Scroll Opacity + Cursor Parallax)
   -------------------------------------------------------------------------- */
function initHeroFloatingIcons() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const iconsContainer = document.querySelector(".hero-floating-icons");

  if (!hero || !iconsContainer) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const CURSOR_PX_MAX = 6;
  const LERP_EASE = 0.08;

  let mouseX = 0;
  let cursorShiftX = 0;
  let rafId: number | null = null;

  function tick() {
    const rect = hero!.getBoundingClientRect();
    const scrollProgress = Math.max(0, -rect.top / rect.height);
    const opacity = 0.25 + Math.min(1, scrollProgress / 0.33) * 0.2;
    hero!.style.setProperty("--hero-icons-opacity", String(opacity));

    if (hasFinePointer) {
      cursorShiftX += (mouseX - cursorShiftX) * LERP_EASE;
      hero!.style.setProperty("--cursor-shift-x", `${cursorShiftX}px`);
    }

    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  if (hasFinePointer) {
    document.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const normalized = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      mouseX = normalized * CURSOR_PX_MAX;
    });
  }

  rafId = requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   Video Modal (case studies with a #videoTrigger)
   -------------------------------------------------------------------------- */
function initVideoModal() {
  const videoTrigger = document.getElementById("videoTrigger");
  const videoModal = document.getElementById("videoModal");
  const videoModalOverlay = document.getElementById("videoModalOverlay");
  const videoModalClose = document.getElementById("videoModalClose");
  const videoIframe = document.getElementById("videoIframe") as HTMLIFrameElement | null;

  if (!videoTrigger || !videoModal || !videoIframe || !videoModalOverlay || !videoModalClose) {
    return;
  }

  const videoId = videoTrigger.dataset.videoId;

  const openModal = () => {
    // mute=1 is required for autoplay in modern browsers (Chrome, Safari, Firefox)
    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`;
    videoModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    videoModal.classList.remove("active");
    setTimeout(() => {
      videoIframe.src = "";
    }, 300); // Wait for animation
    document.body.style.overflow = "";
  };

  // Open modal (click + keyboard)
  videoTrigger.addEventListener("click", openModal);
  videoTrigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  });

  // Close on overlay click
  videoModalOverlay.addEventListener("click", closeModal);

  // Close on button click
  videoModalClose.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) {
      closeModal();
    }
  });
}
