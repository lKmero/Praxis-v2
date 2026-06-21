// Praxis Bendella – main.js
// Handles: hamburger nav, sticky header, scroll reveal, FAQ accordion, calendar, booking form

document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ── Hamburger Menu ────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Sticky Header + CTA ───────────────────────────────────
  const header = document.getElementById('header');
  const headerCta = document.getElementById('header-cta');
  const handleScroll = () => {
    const scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (headerCta) headerCta.style.display = scrolled ? 'inline-flex' : 'none';
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Active nav link ───────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPath ||
        (currentPath.includes(a.getAttribute('href')) && a.getAttribute('href') !== '/index.html')) {
      a.style.color = 'var(--color-primary)';
      a.style.fontWeight = '600';
    }
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── FAQ Accordion ─────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); answer.classList.add('open'); }
    });
  });

  // ── Calendar (only on termin.html) ───────────────────────
  const calDays = document.getElementById('cal-days');
  if (calDays) initCalendar();

  // ── Contact Form (kontakt.html) ───────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Wird gesendet...';
      // Replace with real Formspree endpoint
      await new Promise(r => setTimeout(r, 800));
      contactForm.style.display = 'none';
      const success = document.getElementById('contact-success');
      if (success) { success.style.display = 'flex'; }
    });
  }

  // ── Booking Form (termin.html) ────────────────────────────
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(bookingForm)) return;
      const btn = document.getElementById('booking-submit');
      btn.disabled = true; btn.textContent = 'Wird gesendet...';
      await new Promise(r => setTimeout(r, 800));
      bookingForm.style.display = 'none';
      const success = document.getElementById('booking-success');
      if (success) success.classList.add('visible');
    });
  }
});

// ── Form Validation ─────────────────────────────────────────
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group, .form-check');
    const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    if (empty) { if (group) group.classList.add('has-error'); valid = false; }
    else { if (group) group.classList.remove('has-error'); }
  });
  return valid;
}

// ── Calendar Logic ──────────────────────────────────────────
function initCalendar() {
  const calDays = document.getElementById('cal-days');
  const calMonth = document.getElementById('cal-month');
  const slotsWrap = document.getElementById('time-slots');
  const slotsGrid = document.getElementById('slots-grid');
  const bookingInfo = document.getElementById('booking-info');
  let current = new Date(); current.setDate(1);
  let selectedDate = null, selectedSlot = null;

  const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const SLOTS = ['09:00','09:50','10:40','11:30','14:00','14:50','15:40','16:30','17:20'];

  function render() {
    const year = current.getFullYear(), month = current.getMonth();
    calMonth.textContent = MONTHS[month] + ' ' + year;
    calDays.innerHTML = '';
    const first = new Date(year, month, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const days = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);

    for (let i = 0; i < offset; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty'; calDays.appendChild(el);
    }
    for (let d = 1; d <= days; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      el.textContent = d;
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (date < today) el.classList.add('past');
      else if (dow === 0 || dow === 6) el.classList.add('weekend');
      if (date.toDateString() === today.toDateString()) el.classList.add('today');
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) el.classList.add('selected');
      el.addEventListener('click', () => { if (!el.classList.contains('past') && !el.classList.contains('weekend') && !el.classList.contains('empty')) selectDate(date); });
      calDays.appendChild(el);
    }
  }

  function selectDate(date) {
    selectedDate = date; selectedSlot = null;
    render();
    slotsWrap.style.display = 'block';
    slotsGrid.innerHTML = '';
    SLOTS.forEach(t => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'slot'; el.textContent = t;
      el.addEventListener('click', () => {
        slotsGrid.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        el.classList.add('selected'); selectedSlot = t;
        const info = document.getElementById('booking-info');
        if (info) {
          const d = selectedDate.toLocaleDateString('de-DE', {weekday:'long',day:'numeric',month:'long'});
          info.textContent = `Gewählter Termin: ${d} um ${t} Uhr`;
          info.classList.add('visible');
        }
      });
      slotsGrid.appendChild(el);
    });
  }

  document.getElementById('cal-prev').addEventListener('click', () => { current.setMonth(current.getMonth()-1); render(); });
  document.getElementById('cal-next').addEventListener('click', () => { current.setMonth(current.getMonth()+1); render(); });
  render();
}
