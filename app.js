// Application state
let currentSection = 'home';

// DOM elements
let navLinks, sections, navToggle, navMenu, modal, modalImage, modalTitle, modalDescription;

// Mockup data
const mockupData = {
    mockup1: {
        title: 'Ecrã de Login',
        description: 'Interface de autenticação simples e intuitiva com design moderno e campos de entrada otimizados para agricultores.',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1750100450/gpt4o_images/xkmrplyqe7ifjxls4ueb.png'
    },
    mockup2: {
        title: 'Dashboard Principal',
        description: 'Visualização em tempo real dos dados dos sensores com gráficos intuitivos e métricas essenciais para a tomada de decisões.',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1750100535/gpt4o_images/h4ohvxmusxo037ohdltn.png'
    },
    mockup3: {
        title: 'Recomendações e Alertas',
        description: 'Sistema inteligente de recomendações de irrigação baseado em algoritmos de IA e dados dos sensores em tempo real.',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1750100590/gpt4o_images/iezlr8krur4mv0uynryj.png'
    }
};
// Plan selection and pricing toggle functionality
function initializePricingToggle() {
    const toggleBtns = document.querySelectorAll('.pricing-toggle__btn');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const subscriptionPrices = document.querySelectorAll('.subscription-price');
    const subscriptionPeriods = document.querySelectorAll('.subscription-period');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            
            // Update active toggle
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update prices
            priceAmounts.forEach(price => {
                if (price.dataset[period]) {
                    price.textContent = price.dataset[period];
                }
            });
            
            subscriptionPrices.forEach(price => {
                if (price.dataset[period]) {
                    price.textContent = price.dataset[period];
                }
            });
            
            subscriptionPeriods.forEach(period_el => {
                if (period_el.dataset[period]) {
                    period_el.textContent = period_el.dataset[period];
                }
            });
            
            trackEvent('pricing_toggle', { period });
        });
    });
}

// Plan selection
function selectPlan(planType) {
    trackEvent('plan_selected', { plan: planType });
    
    // Store selected plan
    localStorage.setItem('selectedPlan', planType);
    
    // Open contact modal or redirect to signup
    if (planType === 'enterprise') {
        openContactModal();
    } else {
        // For demo purposes, open contact modal
        // In production, this would redirect to signup flow
        openContactModal();
    }
}

// Contact modal functionality
function openContactModal() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = contactModal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeContactModal() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'A enviar...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = 'Enviado! ✓';
        submitBtn.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            closeContactModal();
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            
            // Show success message
            showNotification('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
        }, 1500);
    }, 2000);
    
    trackEvent('contact_form_submitted');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--color-success)' : 'var(--color-info)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize pricing toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    initializePricingToggle();
    
    // Close contact modal when clicking outside
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }
    
    // Close contact modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
            closeContactModal();
        }
    });
});

// Export new functions
window.selectPlan = selectPlan;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.submitContactForm = submitContactForm;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    initializeDOMElements();
    
    // Initialize functionality
    initializeNavigation();
    initializeMobileMenu();
    initializeModalHandlers();
    initializeMilestoneCards();
    
    // Set initial active section
    showSection('home');
    
    // Initialize scroll animations
    setTimeout(initializeScrollAnimations, 100);
});

// Initialize DOM elements
function initializeDOMElements() {
    navLinks = document.querySelectorAll('.nav__link');
    sections = document.querySelectorAll('.section');
    navToggle = document.querySelector('.nav__toggle');
    navMenu = document.querySelector('.nav__menu');
    modal = document.getElementById('modal');
    modalImage = document.getElementById('modal-image');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
}

// Navigation functionality
function initializeNavigation() {
    if (!navLinks) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetSection = href.substring(1);
                showSection(targetSection);
            }
        });
    });
}

function showSection(sectionId) {
    if (!sections) return;
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // Update navigation
    updateActiveNavLink(sectionId);
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track section view
    trackSectionView(sectionId);
}

function updateActiveNavLink(sectionId) {
    if (!navLinks) return;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

function closeMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Modal functionality
function initializeModalHandlers() {
    if (!modal) return;
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(mockupId) {
    if (!modal || !modalImage || !modalTitle || !modalDescription) return;
    
    const mockup = mockupData[mockupId];
    if (!mockup) return;
    
    modalImage.src = mockup.image;
    modalImage.alt = mockup.title;
    modalTitle.textContent = mockup.title;
    modalDescription.textContent = mockup.description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const closeButton = modal.querySelector('.modal__close');
    if (closeButton) {
        closeButton.focus();
    }
    
    // Track modal open
    trackModalOpen(mockupId);
}

function closeModal() {
    if (!modal || !modalImage || !modalTitle || !modalDescription) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset modal content
    modalImage.src = '';
    modalImage.alt = '';
    modalTitle.textContent = '';
    modalDescription.textContent = '';
}

// Milestone cards functionality
function initializeMilestoneCards() {
    const milestoneCards = document.querySelectorAll('.milestone-card');
    
    milestoneCards.forEach(card => {
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMilestone(this);
            }
        });
    });
}

function toggleMilestone(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other milestone cards
    document.querySelectorAll('.milestone-card').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
    } else {
        card.classList.add('expanded');
        card.setAttribute('aria-expanded', 'true');
    }
    
    // Track milestone expansion
    if (!isExpanded) {
        const title = card.querySelector('h3');
        if (title) {
            trackMilestoneExpansion(title.textContent);
        }
    }
}

// Animation on scroll
function initializeScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
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
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.mockup-card, .milestone-card, .component-card, .financial-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Utility functions
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

// Handle window resize
const handleResize = debounce(function() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    if (!navLinks) return;
    
    // Navigate sections with arrow keys when focused on navigation
    if (document.activeElement && document.activeElement.classList.contains('nav__link')) {
        const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
        let newIndex;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            newIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
        }
        
        if (newIndex !== undefined && navLinks[newIndex]) {
            navLinks[newIndex].focus();
        }
    }
});

// Error handling for images
function handleImageError(img, fallbackSrc = '') {
    img.onerror = function() {
        if (fallbackSrc) {
            this.src = fallbackSrc;
        } else {
            this.style.display = 'none';
            const parent = this.parentElement;
            if (parent) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'image-error';
                errorMessage.style.padding = '20px';
                errorMessage.style.textAlign = 'center';
                errorMessage.style.color = 'var(--color-text-secondary)';
                errorMessage.textContent = 'Imagem não disponível';
                parent.appendChild(errorMessage);
            }
        }
    };
}

// Initialize image error handling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => handleImageError(img));
});

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track section views
function trackSectionView(sectionId) {
    trackEvent('section_view', { section: sectionId });
}

// Track modal opens
function trackModalOpen(mockupId) {
    trackEvent('modal_open', { mockup: mockupId });
}

// Track milestone expansions
function trackMilestoneExpansion(milestoneTitle) {
    trackEvent('milestone_expansion', { milestone: milestoneTitle });
}

// Export functions for global access
window.showSection = showSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMilestone = toggleMilestone;