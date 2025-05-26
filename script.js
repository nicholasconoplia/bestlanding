// Audio Setup
const bgMusic = document.getElementById('bgMusic');
const audioControl = document.getElementById('audioControl');
let fadeInterval;
const fadeTime = 2000; // 2 seconds fade
const fadeSteps = 20; // Number of steps in the fade
let isPlaying = false;

// Set initial volume
bgMusic.volume = 0;

// Function to fade audio
function fadeAudio(start, end, duration) {
    clearInterval(fadeInterval);
    
    const diff = end - start;
    const steps = fadeSteps;
    const stepValue = diff / steps;
    const stepTime = duration / steps;
    let current = start;
    let step = 0;

    fadeInterval = setInterval(() => {
        step++;
        current += stepValue;
        bgMusic.volume = Math.min(Math.max(current, 0), 1);

        if (step >= steps) {
            clearInterval(fadeInterval);
            bgMusic.volume = end;
        }
    }, stepTime);
}

// Handle audio looping with crossfade
bgMusic.addEventListener('timeupdate', () => {
    const buffer = 2; // Start fading 2 seconds before the end
    if (bgMusic.currentTime > bgMusic.duration - buffer) {
        fadeAudio(bgMusic.volume, 0, fadeTime);
    }
});

bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 0;
    bgMusic.play();
    fadeAudio(0, 0.5, fadeTime); // Fade in to 50% volume
});

// Handle play button click
audioControl.addEventListener('click', () => {
    if (!isPlaying) {
        // Start playing with fade in
        bgMusic.play();
        fadeAudio(0, 0.5, fadeTime); // Fade in to 50% volume
        audioControl.classList.remove('muted');
        isPlaying = true;
    } else {
        // Fade out and pause
        fadeAudio(bgMusic.volume, 0, fadeTime);
        setTimeout(() => {
            bgMusic.pause();
        }, fadeTime);
        audioControl.classList.add('muted');
        isPlaying = false;
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (isPlaying) {
            fadeAudio(bgMusic.volume, 0, fadeTime);
        }
    } else {
        if (isPlaying) {
            fadeAudio(0, 0.5, fadeTime);
        }
    }
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Page load fade-in effect
window.addEventListener('load', () => {
    // Small delay to ensure everything is ready
    setTimeout(() => {
        document.querySelector('.fade-in-overlay').classList.add('fade-out');
    }, 100);
});

// Smooth scrolling for navigation links
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

// Hero section animations
gsap.timeline()
    .fromTo('.hero-title', {
        opacity: 0,
        y: 50,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
    })
    .fromTo('.hero-subtitle', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
    }, "-=0.8");

// Section header animations
document.querySelectorAll('.section-header').forEach(header => {
    const elements = header.querySelectorAll('.section-tag, .section-title, .section-subtitle');
    gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// Feature row animations
document.querySelectorAll('.feature-row').forEach((row, index) => {
    // Alternate animation direction based on row index
    const isEven = index % 2 === 0;
    const textElement = row.querySelector('.feature-text');
    const imageElement = row.querySelector('.feature-image');

    // Create timeline for each row
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: row,
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate text
    tl.from(textElement, {
        x: isEven ? -50 : 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Animate image
    tl.from(imageElement, {
        x: isEven ? 50 : -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5");
});

// Duplicate testimonials for infinite scroll
const testimonialsTrack = document.querySelector('.testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');

// Clone the testimonials
testimonialCards.forEach(card => {
    const clone = card.cloneNode(true);
    testimonialsTrack.appendChild(clone);
});

// CTA section animations
const ctaSection = document.querySelector('#section4');
if (ctaSection) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ctaSection,
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tl.from('.cta-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    })
    .from('.phone-mockup', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "all"
    }, "-=0.4");

    // Add floating animation to phone mockup
    gsap.to('.phone-mockup', {
        y: '20px',
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// FAQ section animations
gsap.from('.faq-item', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '.faq-container',
        start: "top 70%",
        toggleActions: "play none none reverse"
    }
});

// Footer animations
gsap.from('.footer-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '.footer',
        start: "top 90%",
        toggleActions: "play none none reverse"
    }
}); 