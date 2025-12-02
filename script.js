// Get elements
const navbar = document.getElementById('navbar');
const navLogo = document.getElementById('navLogo');
const hero = document.getElementById('hero');
const heroBg = document.getElementById('heroBg');
const heroOverlay = document.getElementById('heroOverlay');
const heroContent = document.getElementById('heroContent');
const titleNumber = document.getElementById('titleNumber');
const titleText = document.getElementById('titleText');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Configuration
const HERO_HEIGHT = window.innerHeight;
const ANIMATION_START = 0;
const ANIMATION_END = HERO_HEIGHT * 1.5; // Animation completes after scrolling 1.5x viewport height
const TEXT_ANIMATION_START = HERO_HEIGHT * 0.3; // Start text animation at 30% scroll
const TEXT_ANIMATION_END = HERO_HEIGHT * 0.8; // Complete text animation at 80% scroll

// Scroll handler
function handleScroll() {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / ANIMATION_END, 1);

    // Calculate text animation progress
    const textProgress = Math.min(Math.max((scrollY - TEXT_ANIMATION_START) / (TEXT_ANIMATION_END - TEXT_ANIMATION_START), 0), 1);

    // Navbar blur effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll indicator fade out
    if (scrollY > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }

    // Background zoom: from 180% (80% zoomed in) to 100% (fully zoomed out)
    const bgScale = 180 - (80 * scrollProgress);
    heroBg.style.backgroundSize = `${bgScale}%`;

    // Background position: Start from bottom center, slide to top center when fully zoomed (REVERSED)
    // Vertical position goes from 100% (bottom) to 0% (top) as we zoom out
    const bgPosY = 100 - (scrollProgress * 100); // 100% to 0%
    heroBg.style.backgroundPosition = `50% ${bgPosY}%`;

    // Slide overlay left off canvas without fading
    const overlayTranslate = -100 * scrollProgress;
    heroOverlay.style.transform = `translateX(${overlayTranslate}%)`;
    heroOverlay.style.opacity = 1;

    // Text animations
    // Fade out "Berners Street"
    titleText.style.opacity = 1 - textProgress;

    // Get navbar position for "16" movement
    const navLogoRect = navLogo.getBoundingClientRect();
    const navbarCenterY = navLogoRect.top + navLogoRect.height / 2;

    // Calculate starting position (above "Berners Street")
    // Position "16" above the center of viewport where "BERNERS STREET" is
    const titleTextRect = titleText.getBoundingClientRect();
    const startTop = titleTextRect.top - 80; // Position above "BERNERS STREET"

    // Shrink "16" from 4rem to smaller size for navbar
    const startFontSize = 4;
    const endFontSize = 1.5;
    const numberFontSize = startFontSize - (startFontSize - endFontSize) * textProgress;

    // Get navbar logo element
    const logoText = navLogo.querySelector('.logo-text');

    // Always keep the animated "16" visible and moving
    const currentTop = startTop - (startTop - navbarCenterY) * textProgress;
    titleNumber.style.fontSize = `${numberFontSize}rem`;
    titleNumber.style.top = `${currentTop}px`;
    titleNumber.style.transform = 'translate(-50%, -50%)';

    // Calculate the actual position difference between hero "16" and navbar center
    const titleNumberRect = titleNumber.getBoundingClientRect();
    const heroNumberCenterY = titleNumberRect.top + titleNumberRect.height / 2;
    const diff = heroNumberCenterY - navbarCenterY; // positive: hero below nav

    // Crossfade range in pixels around navbar center
    const fadeRange = 50; // adjust for smoother/sharper transition

    let heroOpacity, navOpacity;

    if (diff >= fadeRange) {
        // Hero "16" still well below navbar center
        heroOpacity = 1;
        navOpacity = 0;
    } else if (diff <= -fadeRange) {
        // Hero "16" has moved well above navbar center (shouldn't happen but just in case)
        heroOpacity = 0;
        navOpacity = 1;
    } else {
        // In the crossfade zone - seamless transition
        const t = (diff + fadeRange) / (2 * fadeRange); // 1 → 0 as hero moves up
        heroOpacity = t;
        navOpacity = 1 - t;
    }

    // Apply opacity to hero "16"
    titleNumber.style.opacity = heroOpacity.toString();

    // Apply to navbar "16"
    if (navOpacity > 0) {
        logoText.style.display = 'block';
        logoText.style.opacity = navOpacity.toString();
        logoText.style.fontSize = `${endFontSize}rem`;
        logoText.style.color = 'white';
        logoText.style.fontWeight = '700';
        logoText.style.letterSpacing = '4px';
    } else {
        logoText.style.display = 'none';
    }

    // Fade out subtitle and details
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDetails = document.querySelector('.hero-details');
    if (heroSubtitle) heroSubtitle.style.opacity = 1 - textProgress;
    if (heroDetails) heroDetails.style.opacity = 1 - textProgress;
}

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add scroll listener with throttling
window.addEventListener('scroll', throttle(handleScroll, 10));

// Initialize on page load
handleScroll();

// Recalculate on window resize
window.addEventListener('resize', () => {
    handleScroll();
});
