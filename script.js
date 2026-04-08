/**
 * PORTFOLIO - PURE VANILLA JAVASCRIPT
 * Attractive Backgrounds + Responsive Scroll Animations
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
const canvas = document.getElementById('particleCanvas');

// ========================================
// PARTICLE CANVAS BACKGROUND
// ========================================
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between particles
function drawConnections() {
    const maxDistance = 120;
    const maxConnections = 3;

    for (let i = 0; i < particles.length; i++) {
        let connections = 0;
        
        for (let j = i + 1; j < particles.length; j++) {
            if (connections >= maxConnections) break;
            
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                connections++;
            }
        }
    }
}

// Animation loop
let frameCount = 0;
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles (every 2nd frame for performance)
    if (frameCount % 2 === 0) {
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        drawConnections();
    } else {
        particles.forEach(particle => particle.draw());
        drawConnections();
    }
    
    frameCount++;
    animationId = requestAnimationFrame(animateParticles);
}

// Start particles
initParticles();
animateParticles();

// Pause animation when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateParticles();
    }
});

// ========================================
// INFINITE LOOP ROLE ANIMATION
// ========================================
const roles = document.querySelectorAll('.role');
let currentRoleIndex = 0;
const roleInterval = 3000;

function updateRoles() {
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

    roleDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentRoleIndex);
    });
}

function nextRole() {
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    updateRoles();
}

let roleTimer = setInterval(nextRole, roleInterval);

roleDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentRoleIndex = index;
        updateRoles();
        clearInterval(roleTimer);
        roleTimer = setInterval(nextRole, roleInterval);
    });
});

updateRoles();

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
});

scrollRevealElements.forEach(el => {
    revealObserver.observe(el);
});

// ========================================
// STAT COUNTER ANIMATION
// ========================================
const statCards = document.querySelectorAll('.stat-card');

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueEl = entry.target.querySelector('.stat-value');
            const target = parseInt(valueEl.dataset.target);
            
            if (valueEl && target) {
                animateCounter(valueEl, target);
            }
            
            entry.target.classList.add('visible');
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statCards.forEach(card => {
    statObserver.observe(card);
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function handleNavbarScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Throttled scroll handler
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            handleNavbarScroll();
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

const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
    });
});

// ========================================
// SMOOTH SCROLL
// ========================================
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        showNotification(`Thank you, ${name}! Your message has been sent.`, 'success');
        this.reset();
    });
}

// Notification helper
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(244, 63, 94, 0.9)'};
        color: white;
        border-radius: 0.75rem;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// PARALLAX EFFECT FOR MESH BLOBS
// ========================================
const meshBlobs = document.querySelectorAll('.mesh-blob');

function handleParallax() {
    const scrollY = window.scrollY;
    
    meshBlobs.forEach((blob, index) => {
        const speed = 0.05 + (index * 0.02);
        const yPos = scrollY * speed;
        blob.style.transform = `translateY(${yPos}px)`;
    });
}

let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        requestAnimationFrame(() => {
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
// SERVICE CARD ANIMATION
// ========================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// SKILL TAGS STAGGER
// ========================================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ========================================
// PREFERS REDUCED MOTION
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable particle animation
    cancelAnimationFrame(animationId);
    
    // Show all scroll reveals
    scrollRevealElements.forEach(el => {
        el.classList.add('visible');
    });
    
    // Stop role animation
    clearInterval(roleTimer);
    
    // Show all roles stacked
    roles.forEach(role => {
        role.style.position = 'relative';
        role.style.opacity = '1';
        role.style.transform = 'none';
    });
}

// ========================================
// CONSOLE GREETING
// ========================================
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #22d3ee;');
console.log('%cThis portfolio is built with pure HTML, CSS, and JavaScript!', 'font-size: 14px; color: #9ca3af;');
console.log('%c✨ Features:', 'font-size: 14px; color: #ec4899; font-weight: bold;');
console.log('%c  • Animated particle canvas background', 'font-size: 12px; color: #6b7280;');
console.log('%c  • Gradient mesh blob animations', 'font-size: 12px; color: #6b7280;');
console.log('%c  • Infinite loop role animation', 'font-size: 12px; color: #6b7280;');
console.log('%c  • Scroll reveal animations', 'font-size: 12px; color: #6b7280;');
console.log('%c  • Stat counter animations', 'font-size: 12px; color: #6b7280;');

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    handleNavbarScroll();
    document.body.classList.add('loaded');
});
