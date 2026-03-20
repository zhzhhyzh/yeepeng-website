/* Year */
document.getElementById('year').textContent = new Date().getFullYear()

/* Reveal on scroll */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); }
  })
},{ threshold: 0.12 })
document.querySelectorAll('[data-animate]').forEach(el=>observer.observe(el))

/* Parallax */
window.addEventListener('scroll', ()=>{
  const hero = document.querySelector('[data-parallax]')
  if(!hero) return
  const y = window.scrollY * 0.15
  hero.style.backgroundPosition = `center calc(50% + ${y}px)`
}, { passive:true })

/* Theme toggle (persist) */
const root = document.documentElement
const saved = localStorage.getItem('mode')
if(saved === 'dark') root.classList.add('dark')
document.querySelector('.mode-toggle').addEventListener('click', ()=>{
  root.classList.toggle('dark')
  localStorage.setItem('mode', root.classList.contains('dark') ? 'dark' : 'light')
})

/* ======================================
   GOOEY NAV EFFECT
   ====================================== */

function initGooeyNav() {
  const container = document.querySelector('.gooey-nav-container');
  if (!container) return;
  
  const navList = container.querySelector('.gooey-nav-list');
  const filterEl = container.querySelector('.effect.filter');
  const textEl = container.querySelector('.effect.text');
  const items = navList.querySelectorAll('li');
  let activeIndex = 0;
  
  // Find the initially active item
  items.forEach((li, idx) => {
    if (li.classList.contains('active')) activeIndex = idx;
  });
  
  const config = {
    animationTime: 600,
    particleCount: 15,
    particleDistances: [90, 10],
    particleR: 100,
    timeVariance: 300,
    colors: [1, 2, 3, 1, 2, 3, 1, 4]
  };
  
  const noise = (n = 1) => n / 2 - Math.random() * n;
  
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  
  function updateEffectPosition(el) {
    const containerRect = container.getBoundingClientRect();
    const pos = el.getBoundingClientRect();
    const styles = {
      left: (pos.x - containerRect.x) + 'px',
      top: (pos.y - containerRect.y) + 'px',
      width: pos.width + 'px',
      height: pos.height + 'px'
    };
    Object.assign(filterEl.style, styles);
    Object.assign(textEl.style, styles);
    textEl.innerText = el.querySelector('a').innerText;
  }
  
  function makeParticles(element) {
    const d = config.particleDistances;
    const r = config.particleR;
    const bubbleTime = config.animationTime * 2 + config.timeVariance;
    element.style.setProperty('--time', bubbleTime + 'ms');
    
    for (let i = 0; i < config.particleCount; i++) {
      const t = config.animationTime * 2 + noise(config.timeVariance * 2);
      const startXY = getXY(d[0], config.particleCount - i, config.particleCount);
      const endXY = getXY(d[1] + noise(7), config.particleCount - i, config.particleCount);
      let rotate = noise(r / 10);
      rotate = rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10;
      const scale = 1 + noise(0.2);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      element.classList.remove('active');
      
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', startXY[0] + 'px');
        particle.style.setProperty('--start-y', startXY[1] + 'px');
        particle.style.setProperty('--end-x', endXY[0] + 'px');
        particle.style.setProperty('--end-y', endXY[1] + 'px');
        particle.style.setProperty('--time', t + 'ms');
        particle.style.setProperty('--scale', scale);
        particle.style.setProperty('--color', 'var(--color-' + color + ', white)');
        particle.style.setProperty('--rotate', rotate + 'deg');
        
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => { element.classList.add('active'); });
        
        setTimeout(() => {
          try { element.removeChild(particle); } catch(e) {}
        }, t);
      }, 30);
    }
  }
  
  // Click handlers
  items.forEach((li, index) => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeIndex === index) {
        // Still navigate to section even if already active
        const href = li.querySelector('a').getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      
      items[activeIndex].classList.remove('active');
      activeIndex = index;
      li.classList.add('active');
      
      updateEffectPosition(li);
      
      // Clear old particles
      filterEl.querySelectorAll('.particle').forEach(p => p.remove());
      
      // Trigger text animation
      textEl.classList.remove('active');
      void textEl.offsetWidth;
      textEl.classList.add('active');
      
      // Create particles
      makeParticles(filterEl);
      
      // Navigate to section
      const href = li.querySelector('a').getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Initialize position
  if (items[activeIndex]) {
    items[activeIndex].classList.add('active');
    setTimeout(() => {
      updateEffectPosition(items[activeIndex]);
      textEl.classList.add('active');
    }, 100);
  }
  
  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    if (items[activeIndex]) updateEffectPosition(items[activeIndex]);
  });
  resizeObserver.observe(container);
  
  // Return items and activeIndex for scroll spy integration
  return { items, getActiveIndex: () => activeIndex, setActiveIndex: (idx) => {
    if (idx !== activeIndex && items[idx]) {
      items[activeIndex].classList.remove('active');
      activeIndex = idx;
      items[activeIndex].classList.add('active');
      updateEffectPosition(items[activeIndex]);
    }
  }};
}

// Initialize gooey nav
const gooeyNav = initGooeyNav();

/* Mobile hamburger menu */
const hamburger = document.querySelector('.hamburger')
const mobileNav = document.getElementById('mobile-nav')
const mobileNavLinks = document.querySelectorAll('.mobile-nav__link')
const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop')
const mobileThemeToggle = document.querySelector('.mobile-nav__theme-toggle')

// Touch swipe detection variables
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0
const swipeThreshold = 80

// Helper function to open mobile nav
function openMobileNav() {
  mobileNav.classList.add('is-open')
  hamburger.classList.add('active')
  hamburger.setAttribute('aria-expanded', 'true')
  mobileNav.setAttribute('aria-hidden', 'false')
  document.body.classList.add('menu-open')
  
  // Focus trap - focus first link after animation
  setTimeout(() => {
    const firstLink = mobileNav.querySelector('.mobile-nav__link')
    if (firstLink) firstLink.focus()
  }, 400)
}

// Helper function to close mobile nav
function closeMobileNav() {
  mobileNav.classList.remove('is-open')
  hamburger.classList.remove('active')
  hamburger.setAttribute('aria-expanded', 'false')
  mobileNav.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('menu-open')
  hamburger.focus()
}

// Toggle mobile nav
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open')
    if (isOpen) {
      closeMobileNav()
    } else {
      openMobileNav()
    }
  })
  
  // Close menu when a nav link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav()
    })
  })
  
  // Close menu when clicking on backdrop
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav)
  }
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileNav()
    }
  })
  
  // Swipe gesture support - detect swipe right to close
  mobileNav.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }, { passive: true })
  
  mobileNav.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleSwipe()
  }, { passive: true })
  
  function handleSwipe() {
    const deltaX = touchEndX - touchStartX
    const deltaY = Math.abs(touchEndY - touchStartY)
    
    // Swipe right to close (horizontal swipe with minimal vertical movement)
    if (deltaX > swipeThreshold && deltaY < 100 && mobileNav.classList.contains('is-open')) {
      closeMobileNav()
    }
  }
  
  // Theme toggle in mobile nav
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      root.classList.toggle('dark')
      localStorage.setItem('mode', root.classList.contains('dark') ? 'dark' : 'light')
    })
  }
  
  // Highlight active link based on scroll position
  function updateActiveNavLink() {
    const sections = ['about', 'education', 'experience', 'projects', 'skills', 'awards', 'contact']
    const scrollPosition = window.scrollY + 100
    
    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId)
      if (section) {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const link = mobileNav.querySelector(`a[href="#${sectionId}"]`)
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          mobileNavLinks.forEach(l => l.classList.remove('active'))
          if (link) link.classList.add('active')
          
          // Also update gooey nav if available (desktop)
          if (gooeyNav && gooeyNav.setActiveIndex && window.innerWidth > 768) {
            gooeyNav.setActiveIndex(index)
          }
        }
      }
    })
  }
  
  // Update active link on scroll
  window.addEventListener('scroll', updateActiveNavLink, { passive: true })
  
  // Initial check
  updateActiveNavLink()
  
  // Focus trap within mobile nav
  mobileNav.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !mobileNav.classList.contains('is-open')) return
    
    const focusableElements = mobileNav.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  })
}

/* ======================================
   BORDER GLOW EFFECT
   ====================================== */

function initBorderGlow() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const cards = document.querySelectorAll('.glow-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate cursor angle (0-360) relative to card center
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      const normalizedAngle = angle < 0 ? angle + 360 : angle;
      
      // Calculate edge proximity (how close to edges, 0-1)
      // Lower values mean closer to center, higher means closer to edge
      const edgeX = Math.min(x, rect.width - x) / rect.width;
      const edgeY = Math.min(y, rect.height - y) / rect.height;
      const edgeProximity = 1 - Math.min(edgeX, edgeY) * 2;
      
      // Sensitivity control - adjust for subtle effect
      const sensitivity = 30;
      const glowOpacity = Math.max(0, Math.min(100, edgeProximity * sensitivity * 3.33));
      
      // Update CSS custom properties
      card.style.setProperty('--cursor-angle', normalizedAngle);
      card.style.setProperty('--edge-proximity', glowOpacity);
    }, { passive: true });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--edge-proximity', 0);
    }, { passive: true });
  });
}

// Initialize border glow effect
initBorderGlow();

/* ======================================
   ANIMATED LIST (SCROLL-TRIGGERED STAGGER)
   ====================================== */

function initAnimatedList() {
  const items = document.querySelectorAll('.animated-item');
  
  if (items.length === 0) return;
  
  // Use lower threshold on mobile (items are larger relative to viewport)
  const isMobile = window.innerWidth <= 768;
  const threshold = isMobile ? 0.3 : 0.5;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // Re-triggerable: remove class when scrolled out of view
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: threshold,
    rootMargin: '0px'
  });
  
  items.forEach(item => observer.observe(item));
}

// Initialize animated list effect
initAnimatedList();

/* ======================================
   PROJECTS CAROUSEL
   ====================================== */

function initProjectsCarousel() {
  const carouselWrappers = document.querySelectorAll('.carousel-wrapper');
  
  carouselWrappers.forEach(wrapper => {
    const container = wrapper.querySelector('.carousel-container');
    const track = wrapper.querySelector('.carousel-track');
    const leftBtn = wrapper.querySelector('.carousel-arrow--left');
    const rightBtn = wrapper.querySelector('.carousel-arrow--right');
    const progressBar = container ? container.querySelector('.carousel-progress-bar') : null;
    
    if (!track || !container) return;
    
    // Scroll amount (card width + gap)
    const getScrollAmount = () => {
      const card = track.querySelector('.carousel-card');
      if (!card) return 320;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap) || 24;
      return card.offsetWidth + gap;
    };
    
    // Update progress bar
    function updateProgressBar() {
      if (!progressBar) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const progress = (track.scrollLeft / maxScroll) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
    
    // Update edge fade classes and button states
    function updateScrollState() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      
      // Edge fades
      if (scrollLeft > 10) {
        container.classList.add('has-scroll-left');
      } else {
        container.classList.remove('has-scroll-left');
      }
      
      if (scrollLeft < maxScroll - 10) {
        container.classList.add('has-scroll-right');
      } else {
        container.classList.remove('has-scroll-right');
      }
      
      // Button states
      if (leftBtn) {
        leftBtn.disabled = scrollLeft <= 0;
      }
      if (rightBtn) {
        rightBtn.disabled = scrollLeft >= maxScroll - 1;
      }
      
      // Update progress bar
      updateProgressBar();
    }
    
    // Scroll left
    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        track.scrollBy({
          left: -getScrollAmount(),
          behavior: 'smooth'
        });
        // Mark auto-scroll as completed when user uses arrows
        if (track._autoScrollCleanup) {
          // This will be set in initAutoScroll - user taking manual control
        }
      });
    }
    
    // Scroll right
    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        track.scrollBy({
          left: getScrollAmount(),
          behavior: 'smooth'
        });
      });
    }
    
    // Listen for scroll events
    track.addEventListener('scroll', updateScrollState, { passive: true });
    
    // Initial state
    updateScrollState();
    
    // Update on resize
    window.addEventListener('resize', () => {
      updateScrollState();
    }, { passive: true });
  });
}

// Initialize carousel
initProjectsCarousel();

/* ======================================
   AUTO-SCROLL CAROUSEL WITH PROGRESS BAR
   ====================================== */

function initAutoScroll() {
  const carouselContainers = document.querySelectorAll('.carousel-container');
  
  carouselContainers.forEach(container => {
    const track = container.querySelector('.carousel-track');
    const progressBar = container.querySelector('.carousel-progress-bar');
    const progressContainer = container.querySelector('.carousel-progress');
    
    if (!track) return;
    
    // Check if there's enough content to scroll
    const canScroll = () => track.scrollWidth > track.clientWidth;
    
    let scrollSpeed = 0.5; // pixels per frame
    let isPaused = false;
    let hasCompleted = false; // Track if auto-scroll has finished its one pass
    let pauseTimeout;
    let animationId;
    let lastTime = 0;
    const scrollInterval = 16; // ~60fps timing
    
    // Dragging state for progress bar
    let isDragging = false;
    
    // Update progress bar based on scroll position
    function updateProgressBar() {
      if (!progressBar) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const progress = (track.scrollLeft / maxScroll) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
    
    // Auto-scroll function - ONE PASS ONLY
    function autoScroll(currentTime) {
      // If completed or not enough content, don't scroll
      if (hasCompleted || !canScroll()) {
        return;
      }
      
      // Throttle to prevent too-fast scrolling
      if (currentTime - lastTime < scrollInterval) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      lastTime = currentTime;
      
      if (!isPaused && !isDragging) {
        track.scrollLeft += scrollSpeed;
        updateProgressBar();
        
        // Check if reached the end
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 1) {
          // Mark as completed - NO LOOPING
          hasCompleted = true;
          track.scrollLeft = maxScroll; // Snap to exact end
          updateProgressBar();
          return; // Stop auto-scroll permanently
        }
      }
      
      animationId = requestAnimationFrame(autoScroll);
    }
    
    // Pause on touch start
    track.addEventListener('touchstart', () => {
      isPaused = true;
      clearTimeout(pauseTimeout);
    }, { passive: true });
    
    // Resume after touch ends (with delay) - only if not completed
    track.addEventListener('touchend', () => {
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        if (!hasCompleted) {
          isPaused = false;
        }
      }, 3000);
    }, { passive: true });
    
    // Pause on hover (desktop)
    track.addEventListener('mouseenter', () => {
      isPaused = true;
      clearTimeout(pauseTimeout);
    }, { passive: true });
    
    // Resume after hover (desktop) - only if not completed
    track.addEventListener('mouseleave', () => {
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        if (!hasCompleted) {
          isPaused = false;
        }
      }, 1500);
    }, { passive: true });
    
    // Update progress bar on manual scroll
    track.addEventListener('scroll', () => {
      updateProgressBar();
      
      // Pause auto-scroll on manual interaction
      if (!hasCompleted && !isDragging) {
        isPaused = true;
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
          if (!hasCompleted) {
            isPaused = false;
          }
        }, 3000);
      }
    }, { passive: true });
    
    // === Progress bar click-to-scroll ===
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        if (isDragging) return; // Ignore if was dragging
        
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        track.scrollTo({
          left: maxScroll * percentage,
          behavior: 'smooth'
        });
        
        // Mark as completed since user is manually controlling
        hasCompleted = true;
      });
      
      // === Progress bar drag functionality ===
      let dragStartX = 0;
      let dragStartScroll = 0;
      
      function handleDragStart(e) {
        isDragging = true;
        hasCompleted = true; // User taking control
        isPaused = true;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        dragStartX = clientX;
        dragStartScroll = track.scrollLeft;
        
        // Prevent text selection during drag
        e.preventDefault();
        
        // Add temporary event listeners for drag
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
      }
      
      function handleDragMove(e) {
        if (!isDragging) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const rect = progressContainer.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        track.scrollLeft = maxScroll * percentage;
        updateProgressBar();
        
        e.preventDefault();
      }
      
      function handleDragEnd() {
        isDragging = false;
        
        // Remove temporary event listeners
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      }
      
      progressContainer.addEventListener('mousedown', handleDragStart);
      progressContainer.addEventListener('touchstart', handleDragStart, { passive: false });
    }
    
    // Initial progress bar update
    updateProgressBar();
    
    // Start auto-scroll if there's content to scroll
    if (canScroll()) {
      animationId = requestAnimationFrame(autoScroll);
    }
    
    // Store cleanup function
    track._autoScrollCleanup = () => {
      cancelAnimationFrame(animationId);
      clearTimeout(pauseTimeout);
    };
    
    // Update progress bar on resize
    window.addEventListener('resize', () => {
      updateProgressBar();
    }, { passive: true });
  });
}

// Initialize auto-scroll on load
initAutoScroll();

// Re-initialize on resize (handle dynamic content changes)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Clean up existing auto-scrolls
    document.querySelectorAll('.carousel-track').forEach(track => {
      if (track._autoScrollCleanup) {
        track._autoScrollCleanup();
        delete track._autoScrollCleanup;
      }
    });
    // Re-initialize
    initAutoScroll();
  }, 250);
}, { passive: true });