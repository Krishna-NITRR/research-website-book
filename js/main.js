/* ═══════════════════════════════════════════
   KRISHNA MAHAWAR — main.js
═══════════════════════════════════════════ */

/* ── Nav scroll shadow ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

/* ── Mobile burger ── */
const burger = document.getElementById('burger');
const mMenu  = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
function closeMobile() {
  mMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

/* ── Fade-in on scroll ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.fade').forEach(el => io.observe(el));

/* ── Hero instant reveal ── */
setTimeout(() => document.getElementById('hero-text')?.classList.add('vis'), 80);
setTimeout(() => document.getElementById('hero-right')?.classList.add('vis'), 240);

/* ── Signup form → POST /api/signup ── */
async function submitSignup(e) {
  e.preventDefault();
  const f   = e.target;
  const btn = f.querySelector('.f-submit');
  const email = f.email.value.trim();
  if (!email) { alert('Please enter your email address.'); return; }
  btn.disabled = true;
  btn.textContent = 'Saving...';
  try {
    const res  = await fetch('/api/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: f.name.value.trim(), email, stage: f.stage?.value || '' })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('formWrap').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    } else {
      alert(data.error || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Join the Waitlist';
    }
  } catch (err) {
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Join the Waitlist';
  }
}

/* ── Contact form → POST /api/contact ── */
async function submitContact(e) {
  e.preventDefault();
  const f   = e.target;
  const btn = f.querySelector('.f-submit');
  const email   = f.email.value.trim();
  const message = f.message.value.trim();
  if (!email || !message) { alert('Please enter your email and message.'); return; }
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: f.name.value.trim(), email, subject: f.subject.value.trim(), message })
    });
    const data = await res.json();
    if (data.success) {
      f.style.display = 'none';
      document.getElementById('contactSuccess').classList.add('show');
    } else {
      alert(data.error || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  } catch (err) {
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
}
