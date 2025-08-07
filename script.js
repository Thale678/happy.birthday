// DOM Elements
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const timelineTrack = document.getElementById('timelineTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// State
let currentSlide = 0;
let currentGalleryIndex = 0;
let isPlaying = false;
const totalSlides = 5;
const galleryImages = Array.from(galleryItems).map(item => item.dataset.src);

// Music Control
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i><span>Play Our Song</span>';
        musicBtn.style.background = 'var(--gradient-primary)';
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
        musicBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause Music</span>';
        musicBtn.style.background = 'var(--gradient-secondary)';
    }
    isPlaying = !isPlaying;
});

// Timeline Carousel
function updateTimeline() {
    const translateX = -currentSlide * 100;
    timelineTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateTimeline();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateTimeline();
}

function goToSlide(index) {
    currentSlide = index;
    updateTimeline();
}

// Timeline Event Listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Auto-play timeline
setInterval(nextSlide, 5000);

// Gallery Lightbox
function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImage.src = galleryImages[index];
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function nextGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentGalleryIndex];
}

function prevGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentGalleryIndex];
}

// Gallery Event Listeners
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextGalleryImage);
lightboxPrev.addEventListener('click', prevGalleryImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevGalleryImage();
                break;
            case 'ArrowRight':
                nextGalleryImage();
                break;
        }
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.timeline-section, .love-letter-section, .gallery-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preload images for better performance
function preloadImages() {
    galleryImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    updateTimeline();
    
    // Add entrance animation to header
    setTimeout(() => {
        document.querySelector('.header').style.opacity = '1';
        document.querySelector('.header').style.transform = 'translateY(0)';
    }, 300);
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

timelineTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

timelineTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

// Prevent default touch behavior on timeline
timelineTrack.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });