// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BlogVerse - Initializing animations...');

    // Check if Lenis is available
    if (typeof Lenis === 'undefined') {
        console.error('❌ Lenis not loaded. Using fallback animations.');
        initFallbackMode();
        return;
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        infinite: false,
    });

    // Lenis animation frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initialize all features
    initCharacterAnimation();
    initBlogCardAnimations();
    initScrollProgress(lenis);
    initParallaxEffects(lenis);
    initNavigationScroll(lenis);
    initButtonInteractions(lenis);

    console.log('✅ BlogVerse animations initialized successfully!');
});

// 3D Character Animation
function initCharacterAnimation() {
    const characterContainer = document.querySelector('.character-container');
    
    if (!characterContainer) return;

    // Animate character entrance
    setTimeout(() => {
        characterContainer.classList.add('loaded');
        console.log('🎭 3D Character animated in');
    }, 1000);

    // Handle Spline viewer events
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        splineViewer.addEventListener('load', () => {
            console.log('✅ 3D Character model loaded successfully');
        });

        splineViewer.addEventListener('error', (e) => {
            console.log('⚠️ 3D Character model failed to load:', e);
        });
    }
}

// Blog Card Animations with Intersection Observer
function initBlogCardAnimations() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (blogCards.length === 0) {
        console.log('⚠️ No blog cards found');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    let animatedCards = new Set();

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !animatedCards.has(entry.target)) {
                const cardIndex = Array.from(blogCards).indexOf(entry.target);
                
                // Staggered animation with delay for cards in one row
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    animatedCards.add(entry.target);
                    console.log(`🃏 Card ${cardIndex + 1} animated in`);
                }, cardIndex * 200); // 200ms delay between each card for better effect
            }
        });
    }, observerOptions);

    // Observe all blog cards
    blogCards.forEach(card => {
        cardObserver.observe(card);
    });

    console.log(`📚 Observing ${blogCards.length} blog cards for animation`);
}

// Scroll Progress Indicator
function initScrollProgress(lenis) {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) return;

    function updateScrollProgress() {
        const scrolled = window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / totalHeight) * 100;
        
        scrollProgress.style.height = `${Math.min(progress, 100)}%`;
    }

    if (lenis) {
        lenis.on('scroll', updateScrollProgress);
    } else {
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
    }

    console.log('📊 Scroll progress indicator initialized');
}

// Parallax Background Effects
function initParallaxEffects(lenis) {
    const parallaxElements = {
        hero: document.querySelector('.parallax-bg'),
        blog: document.querySelector('.parallax-blog'),
        about: document.querySelector('.parallax-about')
    };

    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        // Different parallax speeds for each section
        if (parallaxElements.hero) {
            const heroSpeed = scrollTop * 0.5;
            parallaxElements.hero.style.transform = `translateY(${heroSpeed}px)`;
        }

        if (parallaxElements.blog) {
            const blogSpeed = (scrollTop - window.innerHeight) * 0.3;
            parallaxElements.blog.style.transform = `translateY(${blogSpeed}px)`;
        }

        if (parallaxElements.about) {
            const aboutSpeed = (scrollTop - window.innerHeight * 2) * 0.4;
            parallaxElements.about.style.transform = `translateY(${aboutSpeed}px)`;
        }
    }

    if (lenis) {
        lenis.on('scroll', updateParallax);
    } else {
        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    console.log('🌊 Parallax effects initialized');
}

// Smooth Navigation Scrolling
function initNavigationScroll(lenis) {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                if (lenis) {
                    lenis.scrollTo(targetSection, {
                        duration: 2,
                        offset: -80 // Account for fixed navbar
                    });
                } else {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start' 
                    });
                }
            }
        });
    });

    console.log('🔗 Navigation smooth scroll initialized');
}

// Button Interactions
function initButtonInteractions(lenis) {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Button press animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            const buttonText = this.textContent.toLowerCase();

            // Handle specific button actions
            if (buttonText.includes('start reading')) {
                e.preventDefault();
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    if (lenis) {
                        lenis.scrollTo(blogSection, {
                            duration: 2.5,
                            offset: -80
                        });
                    } else {
                        blogSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }

            if (buttonText.includes('view all posts')) {
                // Add shimmer effect to blog cards
                const blogCards = document.querySelectorAll('.blog-card');
                blogCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'none';
                        card.offsetHeight; // Trigger reflow
                        card.style.animation = 'pulse 0.5s ease-in-out';
                    }, index * 50);
                });
            }
        });

        // Button hover effects
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('border-2')) { // Skip outline buttons
                this.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
            }
        });

        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    console.log('🎯 Button interactions initialized');
}

// Fallback mode for when Lenis doesn't load
function initFallbackMode() {
    console.log('🔄 Running in fallback mode without Lenis');
    
    // Add smooth scrolling CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize features without Lenis dependency
    initCharacterAnimation();
    initBlogCardAnimations();
    initScrollProgress(null);
    initParallaxEffects(null);
    initNavigationScroll(null);
    initButtonInteractions(null);
}

// Page loading effects
window.addEventListener('load', () => {
    // Remove loading states
    document.body.style.opacity = '1';
    
    // Add floating animation to hero shapes
    const floatingShapes = document.querySelectorAll('.floating');
    floatingShapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });

    console.log('🎉 BlogVerse page fully loaded!');
});

// Error handling
window.addEventListener('error', (e) => {
    console.log('⚠️ An error occurred but the page continues working:', e.message);
});

// Add some CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .blog-card:hover {
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
    }
    
    .character-container {
        transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
`;
document.head.appendChild(style);

console.log('📝 BlogVerse script loaded successfully');

// Add mouse follow effect for hero section
document.addEventListener('mousemove', (e) => {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const isInHero = e.clientY >= rect.top && e.clientY <= rect.bottom;
    
    if (isInHero) {
        const shapes = heroSection.querySelectorAll('.floating');
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const translateX = (x - 50) * speed;
            const translateY = (y - 50) * speed;
            
            shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }
});



