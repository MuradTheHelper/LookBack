// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Smooth scrolling for anchor links
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

// Navbar transparency on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .screenshot-item, .support-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form validation (if contact form is added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Copy email to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        showNotification('Email copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add click to copy functionality to email links
document.addEventListener('click', function(e) {
    if (e.target.href && e.target.href.startsWith('mailto:')) {
        e.preventDefault();
        const email = e.target.href.replace('mailto:', '');
        copyToClipboard(email);
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Implement your analytics tracking here
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.href;
        
        trackEvent('button_click', {
            button_text: buttonText,
            button_url: buttonHref,
            page_title: document.title
        });
    }
});

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
                trackEvent('section_view', {
                    section_id: sectionId,
                    section_title: entry.target.querySelector('h1, h2')?.textContent || sectionId
                });
            }
        }
    });
}, { threshold: 0.5 });

// Observe main sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        trackEvent('page_performance', {
            load_time: Math.round(loadTime),
            page_url: window.location.pathname
        });
    }, 0);
});

// Error tracking
window.addEventListener('error', function(e) {
    trackEvent('javascript_error', {
        error_message: e.message,
        error_filename: e.filename,
        error_line: e.lineno,
        page_url: window.location.pathname
    });
});

// Console easter egg
console.log(`
🎉 Welcome to LookBack!
📱 Never miss important moments with our countdown app
🚀 Built with love for iOS users worldwide

Interested in our code? We're always looking for talented developers!
Email us at: careers@lookbackapp.com
`);

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// Add focus indicators for keyboard navigation
document.addEventListener('focusin', function(e) {
    if (e.target.matches('a, button')) {
        e.target.classList.add('keyboard-focus');
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('a, button')) {
        e.target.classList.remove('keyboard-focus');
    }
});