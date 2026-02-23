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

console.log('Slides found:', slides.length); // Debug

function showSlide(n, direction = 'next') {
    if (isTransitioning) return;
    isTransitioning = true;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');

    // Add animation based on direction
    if (direction === 'next') {
        slides[currentSlide].classList.add('slide-out-left');
        slides[n].classList.add('slide-in-right');
    } else {
        slides[currentSlide].classList.add('slide-out-right');
        slides[n].classList.add('slide-in-left');
    }

    // Update indicators
    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[n].classList.add('active');

    // After animation completes
    setTimeout(() => {
        slides[currentSlide].classList.remove('slide-out-left', 'slide-out-right');
        slides[n].classList.remove('slide-in-left', 'slide-in-right');
        
        slides[currentSlide].classList.remove('active');
        slides[n].classList.add('active');

        currentSlide = n;
        isTransitioning = false;
    }, 700);

    // Reset auto-play timer
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
    autoPlayTimer = setTimeout(nextSlide, 5000); // Change image every 5 seconds
}

// Start auto-play
resetAutoPlay();

// Arrow button click handlers
leftArrow.addEventListener('click', () => {
    console.log('Left arrow clicked');
    prevSlide();
});

rightArrow.addEventListener('click', () => {
    console.log('Right arrow clicked');
    nextSlide();
});

// Indicator dot click handlers
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (index !== currentSlide) {
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
        }
    });
});

// Pause auto-play on hover
heroSlideshow.addEventListener('mouseenter', () => {
    clearTimeout(autoPlayTimer);
});

// Resume auto-play when mouse leaves
heroSlideshow.addEventListener('mouseleave', () => {
    resetAutoPlay();
});

// =====================
// SCROLL FUNCTIONALITY
// =====================

// Reserve Button --> Scroll to Booking Form
document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.getElementById('fullName')?.focus();
            }, 700);
        }
    });
});

// Hero "Book Now" Button --> Scroll to Booking Form
const bookNowBtn = document.getElementById('bookNowBtn');
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.getElementById('fullName')?.focus();
            }, 700);
        }
    });
}

// Hero "View Rooms" Button --> Scroll to Rooms Section
const viewRoomsBtn = document.getElementById('viewRoomsBtn');
if (viewRoomsBtn) {
    viewRoomsBtn.addEventListener('click', () => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) {
            roomsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// CTA "Contact Us" Button --> Scroll to Footer
const ctaContactBtn = document.getElementById('ctaContactBtn');
if (ctaContactBtn) {
    ctaContactBtn.addEventListener('click', () => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// =====================
// MOBILE MENU FUNCTIONALITY
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

sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// =====================
// SMOOTH SCROLL ENHANCEMENT
// =====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================
// NAVBAR SCROLL EFFECT
// =====================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(20, 49, 86, 0.15)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// =====================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll(
    '.room-card, .amenity-card, .gallery-item'
);

elementsToAnimate.forEach(element => {
    element.classList.add('scroll-animate');
    observer.observe(element);
});

// =====================
// BOOKING FORM VALIDATION
// =====================

const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccess');
const formInputs = bookingForm?.querySelectorAll('input, textarea, select') || [];

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
    }
}

function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });

    // Validate Full Name
    if (fullName.value.trim() === '') {
        showError(fullName, 'Full name is required');
        isValid = false;
    } else if (fullName.value.trim().length < 3) {
        showError(fullName, 'Full name must be at least 3 characters');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError(email, 'Email address is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Phone
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    if (phone.value.trim() === '') {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim()) || phone.value.trim().length < 10) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate Check-in and Check-out dates if provided
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const today = new Date().toISOString().split('T')[0];

    if (checkIn.value && checkIn.value < today) {
        showError(checkIn, 'Check-in date must be today or in the future');
        isValid = false;
    }

    if (checkOut.value && checkIn.value && checkOut.value <= checkIn.value) {
        showError(checkOut, 'Check-out date must be after check-in date');
        isValid = false;
    }

    return isValid;
}

// =====================
// FORM SUBMISSION
// =====================

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            checkIn: document.getElementById('checkIn').value || 'Not specified',
            checkOut: document.getElementById('checkOut').value || 'Not specified',
            roomType: document.getElementById('roomType').value || 'Not selected',
            message: document.getElementById('message').value || 'No message',
            submittedAt: new Date().toLocaleString()
        };

        // Log form data (in real application, this would be sent to a server)
        console.log('Form Submitted:', formData);

        // Show success message
        showSuccessMessage();

        // Reset form
        bookingForm.reset();
    });
}

// =====================
// SUCCESS MESSAGE FUNCTIONS
// =====================

function showSuccessMessage() {
    successMessage.classList.add('show');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        hideSuccessMessage();
    }, 5000);
}

function hideSuccessMessage() {
    successMessage.classList.remove('show');
}

if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', hideSuccessMessage);
}

// Close success message when clicking outside
if (successMessage) {
    successMessage.addEventListener('click', (e) => {
        if (e.target === successMessage) {
            hideSuccessMessage();
        }
    });
}

// =====================
// REAL-TIME INPUT VALIDATION
// =====================

if (bookingForm) {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    fullName.addEventListener('input', () => {
        if (fullName.value.trim().length >= 3) {
            fullName.closest('.form-group').classList.remove('error');
        }
    });

    email.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email.value.trim())) {
            email.closest('.form-group').classList.remove('error');
        }
    });

    phone.addEventListener('input', () => {
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (phoneRegex.test(phone.value.trim()) && phone.value.trim().length >= 10) {
            phone.closest('.form-group').classList.remove('error');
        }
    });

    checkIn.addEventListener('change', () => {
        const today = new Date().toISOString().split('T')[0];
        if (checkIn.value >= today) {
            checkIn.closest('.form-group').classList.remove('error');
        }
    });

    checkOut.addEventListener('change', () => {
        if (checkOut.value > checkIn.value) {
            checkOut.closest('.form-group').classList.remove('error');
        }
    });

    // Form field focus effects
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.style.transform = 'translateY(-2px)';
            }
        });

        input.addEventListener('blur', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.style.transform = 'translateY(0)';
            }
        });
    });
}

// =====================
// ACTIVE NAV LINK HIGHLIGHTING
// =====================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// =====================
// UTILITY FUNCTIONS
// =====================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =====================
// ADD SCROLL ANIMATION STYLES
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
`;
document.head.appendChild(style);

// =====================
// INITIALIZATION
// =====================

console.log('Premium Luxury Hotel Website - Fully Initialized');
console.log('Features: Hero Slideshow, Smooth Scrolling, Form Validation, Animations');