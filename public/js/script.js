// =====================
// HERO SLIDESHOW
// =====================

const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const leftArrow = document.getElementById('slideLeft');
const rightArrow = document.getElementById('slideRight');
const heroSlideshow = document.querySelector('.hero-slideshow');

let currentSlide = 0;
let autoPlayTimer;
let isTransitioning = false;

document.getElementById('view-gallery').addEventListener('click',()=> alert('Contact the developer to enable this feature'))

function showSlide(n, direction = 'next') {
    if (isTransitioning) return;
    isTransitioning = true;
    const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const inClass  = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add(outClass);
    slides[n].classList.add(inClass, 'active');
    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[n].classList.add('active');
    setTimeout(() => {
        slides[currentSlide].classList.remove(outClass);
        slides[n].classList.remove(inClass);
        currentSlide = n;
        isTransitioning = false;
    }, 1000);
    resetAutoPlay();
}

function nextSlide() { showSlide((currentSlide + 1) % slides.length, 'next'); }
function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length, 'prev'); }

function resetAutoPlay() {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(nextSlide, 5500);
}

resetAutoPlay();
leftArrow?.addEventListener('click', prevSlide);
rightArrow?.addEventListener('click', nextSlide);
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (index !== currentSlide) showSlide(index, index > currentSlide ? 'next' : 'prev');
    });
});
heroSlideshow?.addEventListener('mouseenter', () => clearTimeout(autoPlayTimer));
heroSlideshow?.addEventListener('mouseleave', resetAutoPlay);

// =====================
// SMOOTH SCROLL
// =====================

function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

document.getElementById('bookNowBtn')?.addEventListener('click', () => smoothScrollTo('booking'));
document.getElementById('viewRoomsBtn')?.addEventListener('click', () => smoothScrollTo('rooms'));
document.getElementById('ctaBookBtn')?.addEventListener('click', () => smoothScrollTo('booking'));

document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', () => {
        smoothScrollTo('booking');
        const room = btn.dataset.room;
        if (room) {
            setTimeout(() => {
                const sel = document.getElementById('roomType');
                if (!sel) return;
                const opt = [...sel.options].find(o => o.text === room);
                if (opt) sel.value = opt.value;
            }, 900);
        }
    });
});

// =====================
// MOBILE MENU
// =====================

const hamburger = document.querySelector('.hamburger');
const sidebar   = document.querySelector('.sidebar');
const overlay   = document.getElementById('overlay');
const closeBtn  = document.getElementById('closeBtn');

function closeSidebar() {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.toggle('active');
    overlay?.classList.toggle('active');
    hamburger?.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
closeBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar-link').forEach(l => l.addEventListener('click', closeSidebar));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

// =====================
// NAVBAR SCROLL
// =====================

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, { passive: true });

// =====================
// SCROLL ANIMATIONS
// =====================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const siblings = [...entry.target.parentElement.querySelectorAll('.scroll-animate:not(.visible)')];
            siblings.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 80));
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.room-card, .amenity-card, .gallery-item, .review-card, .nearby-card, .section-header').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
                bar.style.animationDelay = i * 0.15 + 's';
                bar.style.animationPlayState = 'running';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const reviewsSummary = document.querySelector('.reviews-summary');
if (reviewsSummary) {
    reviewsSummary.querySelectorAll('.bar-fill').forEach(bar => { bar.style.animationPlayState = 'paused'; });
    barObserver.observe(reviewsSummary);
}

// =====================
// TOAST
// =====================

function showToast(type, message) {
    document.querySelector('.enquiry-toast')?.remove();
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
        error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };
    const toast = document.createElement('div');
    toast.className = 'enquiry-toast enquiry-toast--' + type;
    toast.innerHTML = '<span class="enquiry-toast__icon">' + icons[type] + '</span><span class="enquiry-toast__msg">' + message + '</span><button class="enquiry-toast__close">&#10005;</button>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('enquiry-toast--visible')));
    const dismiss = () => { clearTimeout(toast._t); toast.classList.remove('enquiry-toast--visible'); setTimeout(() => toast.remove(), 400); };
    toast.querySelector('.enquiry-toast__close').addEventListener('click', dismiss);
    toast._t = setTimeout(dismiss, type === 'success' ? 5000 : 7000);
}

// =====================
// FORM VALIDATION
// =====================

function validateForm() {
    let valid = true;

    document.querySelectorAll('.form-group.error').forEach(g => {
        g.classList.remove('error');
        const s = g.querySelector('.error-message');
        if (s) s.textContent = '';
    });

    function err(id, msg) {
        const input = document.getElementById(id);
        if (!input) return;
        const group = input.parentElement;
        if (group) {
            group.classList.add('error');
            const s = group.querySelector('.error-message');
            if (s) s.textContent = msg;
        }
        valid = false;
    }

    const name     = (document.getElementById('fullName')?.value || '').trim();
    const email    = (document.getElementById('email')?.value || '').trim();
    const phone    = (document.getElementById('phone')?.value || '').trim();
    const checkIn  = document.getElementById('checkIn')?.value || '';
    const checkOut = document.getElementById('checkOut')?.value || '';
    const today    = new Date().toISOString().split('T')[0];

    if (!name)              err('fullName', 'Full name is required');
    else if (name.length < 3) err('fullName', 'Must be at least 3 characters');

    if (!email)             err('email', 'Email address is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err('email', 'Enter a valid email');

    if (!phone)             err('phone', 'Phone number is required');
    else if (!/^[0-9\s\-\+\(\)]+$/.test(phone) || phone.length < 10) err('phone', 'Enter a valid phone number');

    if (checkIn && checkIn < today)               err('checkIn', 'Check-in must be today or future');
    if (checkOut && checkIn && checkOut <= checkIn) err('checkOut', 'Check-out must be after check-in');

    return valid;
}

['fullName', 'email', 'phone'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', function () {
        if (this.value.trim()) this.parentElement?.classList.remove('error');
    });
});

// =====================
// FORM SUBMISSION (DEMO)
// =====================

const submitBtn = document.getElementById('submitEnquiryBtn');

if (submitBtn) {
    submitBtn.addEventListener('click', function () {
        if (!validateForm()) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending\u2026';
        submitBtn.style.opacity = '0.8';

        setTimeout(function () {
            submitBtn.innerHTML = '\u2713 Enquiry Sent';
            submitBtn.style.background = '#1a7a4a';
            submitBtn.style.borderColor = '#1a7a4a';
            submitBtn.style.color = '#fff';
            submitBtn.style.opacity = '1';

            var modal = document.getElementById('successMessage');
            if (modal) modal.style.display = 'flex';

            showToast('success', 'Enquiry sent! Our team will contact you shortly.');
            document.getElementById('bookingForm')?.reset();

            setTimeout(function () {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.color = '';
                submitBtn.style.opacity = '1';
            }, 3000);
        }, 900);
    });
}

// Success modal close
document.getElementById('closeSuccess')?.addEventListener('click', function () {
    var modal = document.getElementById('successMessage');
    if (modal) modal.style.display = 'none';
});
document.getElementById('successMessage')?.addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
});

// =====================
// DYNAMIC STYLES
// =====================

var style = document.createElement('style');
style.textContent = '.btn-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(15,23,42,0.2);border-top-color:#0f172a;border-radius:50%;animation:_spin 0.65s linear infinite;vertical-align:middle;margin-right:6px}@keyframes _spin{to{transform:rotate(360deg)}}.enquiry-toast{position:fixed;bottom:28px;right:28px;z-index:9999;display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:8px;max-width:360px;min-width:240px;background:#fff;box-shadow:0 8px 32px rgba(15,23,42,0.14);font-family:sans-serif;font-size:0.875rem;font-weight:500;color:#0f172a;opacity:0;transform:translateY(12px);transition:opacity 0.35s ease,transform 0.35s ease;border-left:3px solid #ccc}.enquiry-toast--visible{opacity:1;transform:translateY(0)}.enquiry-toast--success{border-left-color:#1a7a4a}.enquiry-toast--error{border-left-color:#c0392b}.enquiry-toast__icon{flex-shrink:0;display:flex;width:18px;height:18px}.enquiry-toast--success .enquiry-toast__icon svg{stroke:#1a7a4a;width:18px;height:18px}.enquiry-toast--error .enquiry-toast__icon svg{stroke:#c0392b;width:18px;height:18px}.enquiry-toast__msg{flex:1;line-height:1.5}.enquiry-toast__close{background:none;border:none;cursor:pointer;color:#94a3b8;font-size:12px;padding:0;flex-shrink:0}@media(max-width:480px){.enquiry-toast{bottom:16px;right:12px;left:12px;max-width:unset}}';
document.head.appendChild(style);

console.log('DEMO HOTEL v3');