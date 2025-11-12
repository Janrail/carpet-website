// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Check if mobile menu elements exist before adding listeners
    if (mobileMenuButton && mobileMenu) {
        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Change hamburger icon to X and back
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // Escape key to close mobile menu
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Ensure navigation stays fixed during scroll
    function ensureFixedNavigation() {
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.position = 'fixed';
            nav.style.top = '0';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.zIndex = '10000';
            nav.style.width = '100%';
            nav.style.background = 'white';
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }
    
    // Call on load and scroll
    ensureFixedNavigation();
    window.addEventListener('scroll', ensureFixedNavigation);
    window.addEventListener('resize', ensureFixedNavigation);

    // Active navigation highlighting for multi-page
    function updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            // Check if current page matches the link
            if ((currentPage === '/' && linkPath === '/') ||
                (currentPage === '/about' && linkPath === '/about') ||
                (currentPage === '/services' && linkPath === '/services') ||
                (currentPage === '/gallery' && linkPath === '/gallery') ||
                (currentPage === '/contact' && linkPath === '/contact')) {
                link.classList.add('active');
            }
        });
    }
    
    // Navigation scroll effect
    function handleNavScroll() {
        const nav = document.querySelector('nav');
        
        if (window.scrollY > 50) {
            nav.classList.add('shadow-xl');
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.classList.remove('shadow-xl');
            nav.style.backgroundColor = 'white';
            nav.style.backdropFilter = 'none';
        }
    }
    
    // Throttled scroll event listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add stagger effect for multiple elements
                if (entry.target.parentElement.children.length > 1) {
                    Array.from(entry.target.parentElement.children).forEach((child, index) => {
                        if (child.classList.contains('service-card') || child.classList.contains('feature-card')) {
                            setTimeout(() => {
                                child.classList.add('stagger-animation');
                            }, index * 100);
                        }
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .gallery-item, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Hero Text Slider Functionality
    initHeroTextSlider();
    
    // Micro-interactions for enhanced user engagement
    initMicroInteractions();
    
    // Form submission handling
    function handleFormSubmission() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Skip the contact form - it has its own handler with email functionality
            if (form.id === 'contactForm') {
                return;
            }
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                
                // Simple validation
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('border-red-500');
                    } else {
                        field.classList.remove('border-red-500');
                    }
                });
                
                if (isValid) {
                    // Show success message
                    showNotification('Thank you for your inquiry! We will get back to you soon.', 'success');
                    form.reset();
                } else {
                    showNotification('Please fill in all required fields.', 'error');
                }
            });
        });
    }
    
    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${bgColor} text-white`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${iconClass} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Initialize form handling
    handleFormSubmission();
    
    // Initialize navigation
    updateActiveNav();
    
    // Initialize hero slideshow
    initHeroSlideshow();
    
    // Initialize smooth page transitions
    initSmoothPageTransitions();
    
    // Page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Console welcome message
    console.log('%cLocal Carpet Fitter Website', 'color: #dc2626; font-size: 20px; font-weight: bold;');
    console.log('%cServing Hounslow & West London - Developed with HTML, CSS, JavaScript & Tailwind CSS', 'color: #64748b; font-size: 14px;');
    
});

// Smooth page transitions
function initSmoothPageTransitions() {
    // Add smooth transitions to all navigation links
    const navLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's an external link or has special attributes
            if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || this.hasAttribute('download')) {
                return;
            }
            
            e.preventDefault();
            
            // Add fade out effect
            document.body.style.opacity = '0.7';
            document.body.style.transform = 'translateY(-10px)';
            
            // Navigate after short delay
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading state for page transitions
    window.addEventListener('beforeunload', function() {
        document.body.style.opacity = '0.5';
    });
    
    // Reset on page load
    window.addEventListener('pageshow', function() {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
}

// Micro-interactions for enhanced user engagement
function initMicroInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, button[type="submit"]');
    buttons.forEach(button => {
        button.classList.add('ripple');
        
        // Add pulse animation to primary CTAs
        if (button.classList.contains('cta-button')) {
            button.classList.add('pulse-animation');
        }
    });
    
    // Icons are now stable - no floating animations
    
    // Add glow effect to important elements (excluding h1 tags)
    const glowElements = document.querySelectorAll('.text-primary');
    glowElements.forEach(element => {
        element.classList.add('glow-on-hover');
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-section');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Interactive cursor effects
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) {
            const newCursor = document.createElement('div');
            newCursor.className = 'custom-cursor';
            newCursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: rgba(37, 99, 235, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                mix-blend-mode: difference;
            `;
            document.body.appendChild(newCursor);
        }
        
        const currentCursor = document.querySelector('.custom-cursor');
        if (currentCursor) {
            currentCursor.style.left = e.clientX - 10 + 'px';
            currentCursor.style.top = e.clientY - 10 + 'px';
        }
    });
    
    // Enhanced hover states
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .feature-card, .gallery-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'rgba(245, 158, 11, 0.7)';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(37, 99, 235, 0.5)';
            }
        });
    });
    
    // Smooth page transitions
    document.body.classList.add('page-transition');
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Dynamic text shimmer effect removed from h1 tags for static header styling
    
    // Interactive form enhancements
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
        
        // Add typing animation
        input.addEventListener('input', () => {
            input.style.borderColor = '#dc2626';
            input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });
    });
    
    // Scroll-triggered animations
    const scrollElements = document.querySelectorAll('.service-card, .feature-card');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                entry.target.classList.add('fade-in-up');
            }
        });
    });
    
    scrollElements.forEach(el => scrollObserver.observe(el));
    
    // Interactive number counters (if any stats are present)
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        
        const countUp = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(countUp);
            } else {
                counter.textContent = target;
            }
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Enhanced mobile gestures
function initEnhancedMobileGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;
        
        // Swipe navigation
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe left - next page
                console.log('Swiped left');
            } else {
                // Swipe right - previous page
                console.log('Swiped right');
            }
        }
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedMobileGestures();
});

// Hero Background Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide (loop back to 0 if at end)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(showNextSlide, 5000);
    
    // Preload all background images for smooth transitions
    slides.forEach((slide, index) => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage) {
            const img = new Image();
            const url = bgImage.slice(5, -2); // Remove 'url("' and '")'
            img.src = url;
        }
    });
}

// Gallery filtering functionality (for gallery page)
if (window.location.pathname.includes('gallery')) {
    document.addEventListener('DOMContentLoaded', function() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterBtns.forEach(b => {
                        b.classList.remove('active', 'bg-primary', 'text-white');
                        b.classList.add('bg-white', 'text-neutral');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active', 'bg-primary', 'text-white');
                    this.classList.remove('bg-white', 'text-neutral');
                    
                    const filter = this.getAttribute('data-filter');
                    
                    // Filter gallery items
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.classList.contains(`filter-${filter}`)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    });
}

// Gallery tabs functionality (for homepage Our Work section)
function initGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryCategories = document.querySelectorAll('.gallery-category');
    
    if (galleryTabs.length > 0) {
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Remove active class from all tabs
                galleryTabs.forEach(t => {
                    t.classList.remove('active', 'bg-red-600', 'text-white');
                    t.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                // Add active class to clicked tab
                this.classList.add('active', 'bg-red-600', 'text-white');
                this.classList.remove('bg-gray-200', 'text-gray-700');
                
                // Hide all categories
                galleryCategories.forEach(cat => {
                    cat.classList.add('hidden');
                    cat.classList.remove('active');
                });
                
                // Show selected category
                const activeCategory = document.querySelector(`.gallery-category[data-category="${category}"]`);
                if (activeCategory) {
                    activeCategory.classList.remove('hidden');
                    activeCategory.classList.add('active');
                }
            });
        });
    }
}

// Initialize gallery tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGalleryTabs();
});

// Hero Text Slider Function
function initHeroTextSlider() {
    const slides = document.querySelectorAll('.hero-text-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let isTransitioning = false;
    
    if (slides.length === 0) return; // Exit if no slides found
    
    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Remove active class from current slide and make it exit to the left
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('exiting');
        
        // Remove active class from current indicator
        indicators[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = index;
        
        // Add active class to new slide after transition completes
        setTimeout(() => {
            slides.forEach(slide => slide.classList.remove('exiting'));
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            isTransitioning = false;
        }, 2100); // Slightly longer than CSS transition (2s)
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Auto-advance slides every 5 seconds (to account for 2s transition)
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index !== currentSlide) {
                // Reset auto-advance timer when user interacts
                clearInterval(autoSlideInterval);
                showSlide(index);
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
        });
    });
    
    // Pause auto-advance when user hovers over the slider
    const sliderContainer = document.querySelector('.hero-text-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Initialize first slide
    if (slides.length > 0) {
        slides[0].classList.add('active');
        indicators[0].classList.add('active');
    }
}

// FAQ Toggle functionality (for contact page)
if (window.location.pathname.includes('contact')) {
    window.toggleFAQ = function(button) {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        } else {
            answer.classList.add('hidden');
            answer.style.maxHeight = '0px';
            icon.style.transform = 'rotate(0deg)';
        }
    };
}