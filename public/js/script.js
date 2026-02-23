// =====================
// HERO SLIDESHOW WITH ANIMATION
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

    slides[currentSlide].classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');

    if (direction === 'next') {
        slides[currentSlide].classList.add('slide-out-left');
        slides[n].classList.add('slide-in-right');
    } else {
        slides[currentSlide].classList.add('slide-out-right');
        slides[n].classList.add('slide-in-left');
    }

    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[n].classList.add('active');

    setTimeout(() => {
        slides[currentSlide].classList.remove('slide-out-left', 'slide-out-right');
        slides[n].classList.remove('slide-in-left', 'slide-in-right');
        slides[currentSlide].classList.remove('active');
        slides[n].classList.add('active');
        currentSlide = n;
        isTransitioning = false;
    }, 700);

    resetAutoPlay();
}

function nextSlide() {
    const n = (currentSlide + 1) % slides.length;
    showSlide(n, 'next');
}

function prevSlide() {
    const n = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(n, 'prev');
}

function resetAutoPlay() {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(nextSlide, 5000);
}

resetAutoPlay();

leftArrow.addEventListener('click', () => prevSlide());
rightArrow.addEventListener('click', () => nextSlide());

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (index !== currentSlide) {
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
        }
    });
});

heroSlideshow.addEventListener('mouseenter', () => clearTimeout(autoPlayTimer));
heroSlideshow.addEventListener('mouseleave', () => resetAutoPlay());

// =====================
// SCROLL FUNCTIONALITY
// =====================

document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                const nameField = document.getElementById('fullName');
                if (nameField) nameField.focus();
            }, 800);
        }
    });
});

const bookNowBtn = document.getElementById('bookNowBtn');
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                const nameField = document.getElementById('fullName');
                if (nameField) nameField.focus();
            }, 800);
        }
    });
}

const viewRoomsBtn = document.getElementById('viewRoomsBtn');
if (viewRoomsBtn) {
    viewRoomsBtn.addEventListener('click', () => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

const ctaContactBtn = document.getElementById('ctaContactBtn');
if (ctaContactBtn) {
    ctaContactBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// =====================
// MOBILE MENU
// =====================

const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const navLinks = document.querySelectorAll('.nav-link');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
}

hamburger?.addEventListener('click', toggleSidebar);
closeBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);
sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

// =====================
// SMOOTH SCROLL FOR NAV LINKS
// =====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// =====================
// NAVBAR SCROLL EFFECT
// =====================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 8px 24px rgba(0, 0, 0, 0.12)'
        : '0 4px 20px rgba(20, 49, 86, 0.15)';
});

// =====================
// SCROLL ANIMATIONS
// =====================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.room-card, .amenity-card, .gallery-item').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});

// =====================
// ACTIVE NAV LINK
// =====================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// =====================
// FORM VALIDATION
// =====================

const bookingForm = document.getElementById('bookingForm');
const submitBtn = bookingForm?.querySelector('.btn-submit');

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });
}

function validateForm() {
    let isValid = true;
    clearErrors();

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const today = new Date().toISOString().split('T')[0];

    if (!fullName.value.trim()) {
        showFieldError(fullName, 'Full name is required');
        isValid = false;
    } else if (fullName.value.trim().length < 3) {
        showFieldError(fullName, 'Full name must be at least 3 characters');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Email address is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }

    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    if (!phone.value.trim()) {
        showFieldError(phone, 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim()) || phone.value.trim().length < 10) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    if (checkIn.value && checkIn.value < today) {
        showFieldError(checkIn, 'Check-in date must be today or in the future');
        isValid = false;
    }

    if (checkOut.value && checkIn.value && checkOut.value <= checkIn.value) {
        showFieldError(checkOut, 'Check-out date must be after check-in date');
        isValid = false;
    }

    return isValid;
}

// =====================
// SUBMIT BUTTON STATES
// =====================

function setButtonLoading() {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending...`;
    submitBtn.style.opacity = '0.85';
    submitBtn.style.cursor = 'not-allowed';
}

function setButtonSuccess() {
    submitBtn.innerHTML = `
        <svg style="width:18px;height:18px;vertical-align:middle;margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Enquiry Sent!
    `;
    submitBtn.style.background = 'linear-gradient(90deg, #27AE60, #2ecc71)';
    submitBtn.style.color = '#fff';
    submitBtn.style.opacity = '1';
}

function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Enquiry';
    submitBtn.style.background = '';
    submitBtn.style.color = '';
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
}

// =====================
// TOAST NOTIFICATIONS
// =====================

function showToast(type, message) {
    const existing = document.querySelector('.enquiry-toast');
    if (existing) existing.remove();

    const icon = type === 'success'
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    const toast = document.createElement('div');
    toast.className = `enquiry-toast enquiry-toast--${type}`;
    toast.innerHTML = `
        <span class="enquiry-toast__icon">${icon}</span>
        <span class="enquiry-toast__msg">${message}</span>
        <button class="enquiry-toast__close" aria-label="Close">✕</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('enquiry-toast--visible'));
    });

    toast.querySelector('.enquiry-toast__close').addEventListener('click', () => dismissToast(toast));

    const timer = setTimeout(() => dismissToast(toast), type === 'success' ? 5000 : 7000);
    toast._timer = timer;
}

function dismissToast(toast) {
    clearTimeout(toast._timer);
    toast.classList.remove('enquiry-toast--visible');
    setTimeout(() => toast.remove(), 400);
}

// =====================
// SUCCESS MODAL
// =====================

const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccess');

function showSuccessModal() {
    successMessage.classList.add('show');
    setTimeout(() => hideSuccessModal(), 6000);
}

function hideSuccessModal() {
    successMessage.classList.remove('show');
}

closeSuccessBtn?.addEventListener('click', hideSuccessModal);
successMessage?.addEventListener('click', (e) => {
    if (e.target === successMessage) hideSuccessModal();
});

// =====================
// FORM SUBMISSION (FETCH → /send-enquiry)
// =====================

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setButtonLoading();

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            checkIn: document.getElementById('checkIn').value || '',
            checkOut: document.getElementById('checkOut').value || '',
            roomType: document.getElementById('roomType').value || '',
            message: document.getElementById('message').value.trim() || '',
        };

        try {
            const response = await fetch('/send-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setButtonSuccess();
                showSuccessModal();
                showToast('success', 'Enquiry sent! Check your email for confirmation.');
                bookingForm.reset();
                setTimeout(() => resetButton(), 4000);
            } else {
                resetButton();
                showToast('error', result.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            resetButton();
            showToast('error', 'Network error. Please check your connection and try again.');
        }
    });
}

// =====================
// REAL-TIME VALIDATION CLEAR
// =====================

if (bookingForm) {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    fullName.addEventListener('input', () => {
        if (fullName.value.trim().length >= 3) fullName.closest('.form-group').classList.remove('error');
    });
    email.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) email.closest('.form-group').classList.remove('error');
    });
    phone.addEventListener('input', () => {
        if (/^[0-9\s\-\+\(\)]+$/.test(phone.value.trim()) && phone.value.trim().length >= 10) {
            phone.closest('.form-group').classList.remove('error');
        }
    });
    checkIn.addEventListener('change', () => {
        if (checkIn.value >= new Date().toISOString().split('T')[0]) checkIn.closest('.form-group').classList.remove('error');
    });
    checkOut.addEventListener('change', () => {
        if (checkOut.value > checkIn.value) checkOut.closest('.form-group').classList.remove('error');
    });

    bookingForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => { input.closest('.form-group').style.transform = 'translateY(-2px)'; });
        input.addEventListener('blur', () => { input.closest('.form-group').style.transform = 'translateY(0)'; });
    });
}

// =====================
// LAZY LOAD IMAGES
// =====================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// =====================
// DYNAMIC STYLES
// =====================

const style = document.createElement('style');
style.textContent = `
    .scroll-animate {
        opacity: 0;
        transform: translateY(30px);
    }
    .scroll-animate.visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Loading spinner inside button */
    .btn-spinner {
        display: inline-block;
        width: 15px;
        height: 15px;
        border: 2px solid rgba(20, 49, 86, 0.25);
        border-top-color: #143156;
        border-radius: 50%;
        animation: btnSpin 0.65s linear infinite;
        vertical-align: middle;
        margin-right: 8px;
    }
    @keyframes btnSpin {
        to { transform: rotate(360deg); }
    }

    /* Toast */
    .enquiry-toast {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 6px;
        max-width: 380px;
        min-width: 260px;
        background: #fff;
        box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #1a1a2e;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.35s ease, transform 0.35s ease;
        border-left: 4px solid #ccc;
    }
    .enquiry-toast--visible {
        opacity: 1;
        transform: translateY(0);
    }
    .enquiry-toast--success {
        border-left-color: #27AE60;
    }
    .enquiry-toast--error {
        border-left-color: #E74C3C;
    }
    .enquiry-toast__icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        width: 20px;
        height: 20px;
    }
    .enquiry-toast--success .enquiry-toast__icon svg { stroke: #27AE60; width: 20px; height: 20px; }
    .enquiry-toast--error .enquiry-toast__icon svg { stroke: #E74C3C; width: 20px; height: 20px; }
    .enquiry-toast__msg { flex: 1; line-height: 1.5; }
    .enquiry-toast__close {
        background: none;
        border: none;
        cursor: pointer;
        color: #bbb;
        font-size: 13px;
        padding: 0;
        flex-shrink: 0;
        transition: color 0.2s;
    }
    .enquiry-toast__close:hover { color: #555; }

    @media (max-width: 480px) {
        .enquiry-toast {
            bottom: 16px;
            right: 16px;
            left: 16px;
            max-width: unset;
        }
    }
`;
document.head.appendChild(style);

console.log('🏨 DEMO HOTEL — Initialized');