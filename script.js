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
    
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const link = mobileNav.querySelector(`a[href="#${sectionId}"]`)
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          mobileNavLinks.forEach(l => l.classList.remove('active'))
          if (link) link.classList.add('active')
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