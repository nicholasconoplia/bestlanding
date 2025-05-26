// Welcome Screen & Music Setup
document.addEventListener('DOMContentLoaded', function() {
    const welcomeOverlay = document.querySelector('.welcome-overlay');
    const welcomeButton = document.querySelector('.welcome-button');
    const blackOverlay = document.createElement('div');
    blackOverlay.classList.add('black-overlay');
    document.body.appendChild(blackOverlay);

    // Wrap all content except welcome and black overlay in main-content div
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');
    while (document.body.children.length > 2) {
        mainContent.appendChild(document.body.children[2]);
    }
    document.body.appendChild(mainContent);

    // Mouse movement handler
    document.addEventListener('mousemove', (e) => {
        if (welcomeOverlay) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            welcomeOverlay.style.setProperty('--mouse-x', `${x}%`);
            welcomeOverlay.style.setProperty('--mouse-y', `${y}%`);
        }
    });

    let player;
    let fadeInterval;
    const FADE_DURATION = 2000; // 2 seconds fade
    const VOLUME_TARGET = 30; // Target volume (0-100)
    const FADE_STEP = 50; // How often to update volume (ms)

    // Initialize YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // YouTube API will call this function when ready
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('bgMusic', {
            videoId: '9p5Tokd-93k', // Make sure this is set
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'loop': 1,
                'playlist': '9p5Tokd-93k', // Required for looping
                'modestbranding': 1,
                'playsinline': 1,
                'rel': 0,
                'showinfo': 0,
                'mute': 1 // Start muted
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        // Start playing but muted
        player.setVolume(0);
        player.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            player.playVideo();
        }
    }

    function fadeInMusic() {
        if (!player || typeof player.getVolume !== 'function') return;

        // First unmute the player
        player.unMute();
        
        let currentVolume = 0;
        const steps = FADE_DURATION / FADE_STEP;
        const volumeIncrement = VOLUME_TARGET / steps;

        // Clear any existing fade interval
        if (fadeInterval) clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            currentVolume += volumeIncrement;
            if (currentVolume >= VOLUME_TARGET) {
                currentVolume = VOLUME_TARGET;
                clearInterval(fadeInterval);
            }
            player.setVolume(Math.round(currentVolume));
        }, FADE_STEP);
    }

    // Enter button click handler
    welcomeButton.addEventListener('click', () => {
        // Trigger content and glow fade out animations
        welcomeOverlay.querySelector('.welcome-content').classList.add('fade-out');
        welcomeOverlay.classList.add('fade-out');
        
        // Start fading in the music
        fadeInMusic();
        
        // First fade to black after content animation
        setTimeout(() => {
            blackOverlay.classList.add('fade-in');
            
            // After black fade completes, hide welcome screen and fade in content
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
                mainContent.classList.add('fade-in');
                
                // Finally fade out black overlay
                setTimeout(() => {
                    blackOverlay.classList.remove('fade-in');
                }, 1000);
            }, 1000);
        }, 800); // Wait for content fade animation to complete
    });
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

// Smooth scroll for anchor links
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

// Force autoplay on page load
window.addEventListener('load', function() {
    // Try multiple approaches
    function tryAutoplay() {
        // Try audio element
        var audio = document.getElementById('bgAudio');
        if (audio) {
            audio.play().catch(function(error) {
                console.log("Audio autoplay failed, trying YouTube fallback");
            });
        }

        // Try YouTube
        var iframe = document.getElementById('bgMusic');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
    }

    // Try immediately
    tryAutoplay();

    // Also try on first user interaction
    document.body.addEventListener('click', function() {
        tryAutoplay();
    }, { once: true });

    // And on scroll
    window.addEventListener('scroll', function() {
        tryAutoplay();
    }, { once: true });
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

// Page Load Animation
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.fade-in-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
        }, 500);
    }
}); 