/**
 * ==========================================================================
 * PORTOFOLIO DIGITAL SEMINAR PPG - NABILA JIHAN ATHIFAH, S.Ds.
 * Aurevo Framer Style Interactive Behaviors & Micro-Interactions
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarMorph();
  initDropdown();
  initMobileMenu();
  initAnimatedCounters();
  initFaqAccordion();
  initSmoothScrollSpy();
  initSmoothAnchorScrolling();
  initCourseAccordion();
  initCourseFilters();
});

/* ==========================================================================
   1. NAVBAR SCROLL MORPHING (TRANSPARENT -> FLOATING FROSTED PILL)
   ========================================================================== */
function initNavbarMorph() {
  const navbarWrapper = document.getElementById('navbarWrapper');
  if (!navbarWrapper) return;

  let ticking = false;

  const updateNavbarState = () => {
    // 70px threshold gives a buttery, natural response on scroll
    if (window.scrollY > 70) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarState);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNavbarState(); // Initial check
}

/* ==========================================================================
   2. INTERACTIVE NAVBAR DROPDOWN
   ========================================================================== */
function initDropdown() {
  const dropdown = document.getElementById('navDropdown');
  const dropdownBtn = document.getElementById('dropdownBtn');
  if (!dropdown || !dropdownBtn) return;

  // Click toggle (useful for touch & tablet)
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = dropdown.classList.toggle('active');
    dropdownBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (!mobileToggle || !mobileDrawer) return;

  mobileToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });

  // Close drawer when any drawer link is clicked
  const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   4. ANIMATED STAT COUNTERS (Runs when scrolled into view)
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const animateNumber = (el, target, duration = 1600) => {
    const startTime = performance.now();
    const startVal = 0;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(startVal + (target - startVal) * ease);

      el.textContent = currentVal.toLocaleString('id-ID');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            animateNumber(counter, target);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    observer.observe(heroSection);
  }
}

/* ==========================================================================
   5. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items (Aurevo clean single-active style)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* ==========================================================================
   7. ACTIVE NAV LINK SPY ON SCROLL
   ========================================================================== */
function initSmoothScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.dropdown-toggle)');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   8. SMOOTH ANCHOR SCROLLING WITH NAVBAR OFFSET
   ========================================================================== */
function initSmoothAnchorScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Close dropdown if open
        const dropdown = document.getElementById('navDropdown');
        if (dropdown) dropdown.classList.remove('active');
      }
    });
  });
}


/* ==========================================================================
   9. INTERACTIVE COURSE FILTERING (SEM 1, SEM 2, PPL, ALL)
   ========================================================================== */
function initCourseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.case-card');
  if (!filterBtns.length || !courseCards.length) return;

  function applyFilter(filterVal) {
    courseCards.forEach((card) => {
      const sem = card.getAttribute('data-semester');
      const badgeText = card.querySelector('.case-badge-pill')?.textContent || '';
      const isPpl = badgeText.toLowerCase().includes('praktik lapangan');

      if (filterVal === 'all') {
        card.classList.remove('filtered-hidden');
      } else if (filterVal === 'sem1') {
        if (sem === 'sem1') {
          card.classList.remove('filtered-hidden');
        } else {
          card.classList.add('filtered-hidden');
        }
      } else if (filterVal === 'sem2') {
        if (sem === 'sem2') {
          card.classList.remove('filtered-hidden');
        } else {
          card.classList.add('filtered-hidden');
        }
      } else if (filterVal === 'ppl') {
        if (isPpl) {
          card.classList.remove('filtered-hidden');
        } else {
          card.classList.add('filtered-hidden');
        }
      }
    });

    if (typeof window.updateCourseAccordionToggleState === 'function') {
      window.updateCourseAccordionToggleState();
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      applyFilter(filterVal);
    });
  });

  // Apply default active filter on page load (defaults to Semester I)
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    applyFilter(activeBtn.getAttribute('data-filter') || 'sem1');
  }
}


/* ==========================================================================
   10. INTERACTIVE COURSE CARD ACCORDION & GLOBAL TOGGLE
   ========================================================================== */
function initCourseAccordion() {
  const triggers = document.querySelectorAll('.case-card-header-trigger');
  const btnToggleAll = document.getElementById('btnToggleAll');
  const courseCards = document.querySelectorAll('.case-card');

  if (!triggers.length) return;

  // Individual Card Accordion Toggle
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.case-card');
      if (!card) return;

      const isOpen = card.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      updateGlobalToggleState();
    });
  });

  // Global Open / Close All Button
  if (btnToggleAll && courseCards.length) {
    btnToggleAll.addEventListener('click', () => {
      const anyClosed = Array.from(courseCards).some(c => !c.classList.contains('filtered-hidden') && !c.classList.contains('open'));

      courseCards.forEach((card) => {
        if (!card.classList.contains('filtered-hidden')) {
          const trigger = card.querySelector('.case-card-header-trigger');
          if (anyClosed) {
            card.classList.add('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
          } else {
            card.classList.remove('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      updateGlobalToggleState();
    });
  }

  window.updateCourseAccordionToggleState = updateGlobalToggleState;
  function updateGlobalToggleState() {
    if (!btnToggleAll) return;
    const visibleCards = Array.from(courseCards).filter(c => !c.classList.contains('filtered-hidden'));
    const allOpen = visibleCards.every(c => c.classList.contains('open'));

    if (allOpen) {
      btnToggleAll.textContent = 'Tutup Semua Rincian';
      btnToggleAll.setAttribute('data-state', 'all-open');
    } else {
      btnToggleAll.textContent = 'Buka Semua Rincian';
      btnToggleAll.setAttribute('data-state', 'some-closed');
    }
  }

  updateGlobalToggleState();
}
