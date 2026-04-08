/**
 * PORTFOLIO - PURE VANILLA JAVASCRIPT
 * No libraries, no frameworks - just pure JS
 */

// ========================================
// DOM ELEMENTS
// ========================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');
const currentYear = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const roleDots = document.querySelectorAll('.role-dot');

// ========================================
// INFINITE LOOP ROLE ANIMATION
// ========================================
const roles = document.querySelectorAll('.role');
let currentRoleIndex = 0;
const roleInterval = 3000; // 3 seconds

function updateRoles() {
    // Remove all classes
    roles.forEach((role, index) => {
        role.classList.remove('active', 'prev', 'next');
        
        if (index === currentRoleIndex) {
            role.classList.add('active');
        } else if (index < currentRoleIndex) {
            role.classList.add('prev');
        } else {
            role.classList.add('next');
        }
    });

    // Update dots
    roleDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentRoleIndex);
    });
}

function nextRole() {
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    updateRoles();
}

// Start infinite loop
let roleTimer = setInterval(nextRole, roleInterval);

// Click on dots to change role
roleDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentRoleIndex = index;
        updateRoles();
        // Reset timer
        clearInterval(roleTimer);
        roleTimer = setInterval(nextRole, roleInterval);
    });
});

// Initialize first role
updateRoles();

// ========================================
// SCROLL-BASED ANIMATIONS (INTERSECTION OBSERVER)
// ========================================
const scrollElements = document.querySelectorAll('.scroll-animate');

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all scroll-animate elements
scrollElements.forEach(el => {
    scrollObserver.observe(el);
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
let lastScrollY = window.scrollY;

function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
}

// Throttled scroll listener
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ========================================
// MOBILE MENU
// ========================================
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// BACK TO TOP
// ========================================
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// CURRENT YEAR
// ========================================
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ========================================
// CONTACT FORM
// ========================================
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Show success message
        alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`);
        
        // Reset form
        this.reset();
    });
}

// ========================================
// PARALLAX EFFECT FOR ORBS
// ========================================
const orbs = document.querySelectorAll('.orb');

function handleParallax() {
    const scrollY = window.scrollY;
    
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = scrollY * speed;
        orb.style.transform = `translateY(${yPos}px)`;
    });
}

// Throttled parallax
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
            handleParallax();
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
}, { passive: true });

// ========================================
// PROJECT CARD HOVER EFFECT
// ========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// SKILL TAGS STAGGER ANIMATION
// ========================================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
});

// ========================================
// STAT COUNTER ANIMATION
// ========================================
const statValues = document.querySelectorAll('.stat-value');

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
    
    let current = 0;
    const increment = numericValue / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';
        
        element.textContent = displayValue;
    }, stepTime);
}

// Observe stats for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            if (statValue) {
                animateCounter(statValue);
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ========================================
// PREFERS REDUCED MOTION
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.add('visible');
        el.style.transition = 'none';
    });
    
    // Stop role animation
    clearInterval(roleTimer);
    
    // Show all roles
    roles.forEach(role => {
        role.style.opacity = '1';
        role.style.position = 'relative';
        role.style.transform = 'none';
    });
}

// ========================================
// CONSOLE GREETING
// ========================================
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #22d3ee;');
console.log('%cThis portfolio is built with pure HTML, CSS, and JavaScript - no frameworks, no libraries!', 'font-size: 14px; color: #9ca3af;');
console.log('%cFeel free to explore the code. 🚀', 'font-size: 14px; color: #ec4899;');

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check
    handleScroll();
    
    // Add loaded class to body for any initial animations
    document.body.classList.add('loaded');
});
