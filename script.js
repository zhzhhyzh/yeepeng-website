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
if(saved === 'light') root.classList.add('light')
document.querySelector('.mode-toggle').addEventListener('click', ()=>{
  root.classList.toggle('light')
  localStorage.setItem('mode', root.classList.contains('light') ? 'light' : 'dark')
})