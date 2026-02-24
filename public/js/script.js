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

function showSlide(n, direction = 'next') {
    if (isTransitioning) return;
    isTransitioning = true;

    const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const inClass  = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add(outClass);
    slides[n].classList.add(inClass);
    slides[n].classList.add('active');

    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[n].classList.add('active');

    setTimeout(() => {
        slides[currentSlide].classList.remove(outClass, 'slide-out-left', 'slide-out-right');
        slides[n].classList.remove(inClass, 'slide-in-left', 'slide-in-right');
        currentSlide = n;
        isTransitioning = false;
    }, 900);

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
        if (index !== currentSlide) {
            showSlide(index, index > currentSlide ? 'next' : 'prev');
        }
    });
});

heroSlideshow?.addEventListener('mouseenter', () => clearTimeout(autoPlayTimer));
heroSlideshow?.addEventListener('mouseleave', resetAutoPlay);

// =====================
// SCROLL BUTTONS
// =====================

function scrollTo(id, focusId) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (focusId) {
        setTimeout(() => document.getElementById(focusId)?.focus(), 800);
    }
}

document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const room = btn.dataset.room;
        scrollTo('booking', 'fullName');
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

document.getElementById('bookNowBtn')?.addEventListener('click', () => scrollTo('booking', 'fullName'));
document.getElementById('viewRoomsBtn')?.addEventListener('click', () => scrollTo('rooms'));
document.getElementById('ctaContactBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// =====================
// MOBILE MENU
// =====================

const hamburger  = document.querySelector('.hamburger');
const sidebar    = document.querySelector('.sidebar');
const overlay    = document.getElementById('overlay');
const closeBtn   = document.getElementById('closeBtn');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger?.addEventListener('click', toggleSidebar);
closeBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);
sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

// =====================
// SMOOTH SCROLL ANCHORS
// =====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =====================
// NAVBAR SCROLL EFFECT
// =====================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 30px rgba(15,23,42,0.4)';
    } else {
        navbar.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(15,23,42,0.3)';
    }
}, { passive: true });

// =====================
// ACTIVE NAV LINK
// =====================

const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// =====================
// SCROLL ANIMATIONS
// =====================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger cards within the same parent
            const siblings = entry.target.parentElement.querySelectorAll('.scroll-animate:not(.visible)');
            let delay = 0;
            siblings.forEach(el => {
                if (el === entry.target) {
                    setTimeout(() => el.classList.add('visible'), delay);
                    delay += 90;
                }
            });
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.room-card, .amenity-card, .gallery-item').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});

// =====================
// FORM VALIDATION
// =====================

const bookingForm = document.getElementById('bookingForm');
const submitBtn = bookingForm?.querySelector('.btn-submit');

function showFieldError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    const span = group.querySelector('.error-message');
    if (span) span.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.form-group.error').forEach(g => {
        g.classList.remove('error');
        const span = g.querySelector('.error-message');
        if (span) span.textContent = '';
    });
}

function validateForm() {
    clearErrors();
    let valid = true;

    const fullName = document.getElementById('fullName');
    const email    = document.getElementById('email');
    const phone    = document.getElementById('phone');
    const checkIn  = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const today    = new Date().toISOString().split('T')[0];

    if (!fullName.value.trim()) {
        showFieldError(fullName, 'Full name is required'); valid = false;
    } else if (fullName.value.trim().length < 3) {
        showFieldError(fullName, 'Must be at least 3 characters'); valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Email address is required'); valid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address'); valid = false;
    }

    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    if (!phone.value.trim()) {
        showFieldError(phone, 'Phone number is required'); valid = false;
    } else if (!phoneRegex.test(phone.value.trim()) || phone.value.trim().length < 10) {
        showFieldError(phone, 'Please enter a valid phone number'); valid = false;
    }

    if (checkIn.value && checkIn.value < today) {
        showFieldError(checkIn, 'Check-in date must be today or future'); valid = false;
    }

    if (checkOut.value && checkIn.value && checkOut.value <= checkIn.value) {
        showFieldError(checkOut, 'Check-out must be after check-in'); valid = false;
    }

    return valid;
}

// =====================
// SUBMIT STATES
// =====================

function setButtonLoading() {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending…`;
    submitBtn.style.opacity = '0.8';
}

function setButtonSuccess() {
    submitBtn.innerHTML = `
        <svg style="width:16px;height:16px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Enquiry Sent
    `;
    submitBtn.style.background = 'var(--success)';
    submitBtn.style.borderColor = 'var(--success)';
    submitBtn.style.color = '#fff';
    submitBtn.style.opacity = '1';
}

function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Enquiry';
    submitBtn.style.background = '';
    submitBtn.style.borderColor = '';
    submitBtn.style.color = '';
    submitBtn.style.opacity = '1';
}

// =====================
// TOAST
// =====================

function showToast(type, message) {
    document.querySelector('.enquiry-toast')?.remove();

    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
        error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `enquiry-toast enquiry-toast--${type}`;
    toast.innerHTML = `
        <span class="enquiry-toast__icon">${icons[type]}</span>
        <span class="enquiry-toast__msg">${message}</span>
        <button class="enquiry-toast__close" aria-label="Close">✕</button>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('enquiry-toast--visible')));

    const dismiss = () => {
        clearTimeout(toast._t);
        toast.classList.remove('enquiry-toast--visible');
        setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('.enquiry-toast__close').addEventListener('click', dismiss);
    toast._t = setTimeout(dismiss, type === 'success' ? 5000 : 7000);
}

// =====================
// SUCCESS MODAL
// =====================

const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccess');

function showSuccessModal() {
    successMessage.classList.add('show');
    setTimeout(() => successMessage.classList.remove('show'), 6000);
}

closeSuccessBtn?.addEventListener('click', () => successMessage.classList.remove('show'));
successMessage?.addEventListener('click', (e) => {
    if (e.target === successMessage) successMessage.classList.remove('show');
});

// =====================
// FORM SUBMISSION
// =====================

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setButtonLoading();

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email:    document.getElementById('email').value.trim(),
            phone:    document.getElementById('phone').value.trim(),
            checkIn:  document.getElementById('checkIn').value || '',
            checkOut: document.getElementById('checkOut').value || '',
            roomType: document.getElementById('roomType').value || '',
            message:  document.getElementById('message').value.trim() || '',
        };

        try {
            const res = await fetch('/send-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();

            if (res.ok && result.success) {
                setButtonSuccess();
                showSuccessModal();
                showToast('success', 'Enquiry sent! We will be in touch within 24 hours.');
                bookingForm.reset();
                setTimeout(resetButton, 4000);
            } else {
                resetButton();
                showToast('error', result.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            resetButton();
            showToast('error', 'Network error. Please check your connection.');
        }
    });
}

// =====================
// REAL-TIME VALIDATION CLEAR
// =====================

if (bookingForm) {
    const fields = {
        fullName: (v) => v.trim().length >= 3,
        email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        phone:    (v) => /^[0-9\s\-\+\(\)]+$/.test(v.trim()) && v.trim().length >= 10,
    };

    Object.entries(fields).forEach(([id, fn]) => {
        document.getElementById(id)?.addEventListener('input', function () {
            if (fn(this.value)) this.closest('.form-group')?.classList.remove('error');
        });
    });

    const today = new Date().toISOString().split('T')[0];
    const checkIn  = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    checkIn?.addEventListener('change', function () {
        if (this.value >= today) this.closest('.form-group')?.classList.remove('error');
    });
    checkOut?.addEventListener('change', function () {
        if (checkIn && this.value > checkIn.value) this.closest('.form-group')?.classList.remove('error');
    });
}

// =====================
// LAZY LOAD
// =====================

if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
                imgObserver.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// =====================
// DYNAMIC STYLES (Toast + Spinner)
// =====================

const style = document.createElement('style');
style.textContent = `
    .btn-spinner {
        display: inline-block;
        width: 14px; height: 14px;
        border: 2px solid rgba(15,23,42,0.2);
        border-top-color: var(--navy, #0f172a);
        border-radius: 50%;
        animation: _spin 0.65s linear infinite;
        vertical-align: middle;
        margin-right: 6px;
    }
    @keyframes _spin { to { transform: rotate(360deg); } }

    .enquiry-toast {
        position: fixed;
        bottom: 28px; right: 28px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 6px;
        max-width: 360px;
        min-width: 240px;
        background: #fff;
        box-shadow: 0 8px 32px rgba(15,23,42,0.12);
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        font-weight: 500;
        color: #0f172a;
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 0.35s ease, transform 0.35s ease;
        border-left: 3px solid #ccc;
    }
    .enquiry-toast--visible { opacity: 1; transform: translateY(0); }
    .enquiry-toast--success { border-left-color: #1a7a4a; }
    .enquiry-toast--error   { border-left-color: #c0392b; }
    .enquiry-toast__icon    { flex-shrink:0; display:flex; width:18px; height:18px; }
    .enquiry-toast--success .enquiry-toast__icon svg { stroke: #1a7a4a; width:18px; height:18px; }
    .enquiry-toast--error   .enquiry-toast__icon svg { stroke: #c0392b; width:18px; height:18px; }
    .enquiry-toast__msg  { flex: 1; line-height: 1.5; }
    .enquiry-toast__close {
        background: none; border: none; cursor: pointer;
        color: #94a3b8; font-size: 12px; padding: 0; flex-shrink: 0;
        transition: color 0.2s;
    }
    .enquiry-toast__close:hover { color: #334155; }
    @media (max-width: 480px) {
        .enquiry-toast { bottom: 16px; right: 12px; left: 12px; max-width: unset; }
    }
`;
document.head.appendChild(style);

console.log('🏨 DEMO HOTEL — Premium Edition');