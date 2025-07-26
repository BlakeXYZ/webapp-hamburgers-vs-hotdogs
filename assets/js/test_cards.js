// import Swiper JS
import Swiper from 'swiper/bundle';



var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: false,
    speed: 500, // Slide transition speed in ms
    rewind: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    cardsEffect: {
        perSlideOffset: 125, // Increase for more left/right offset (default is 8)
        perSlideRotate: 0,
        rotate: true, // You can also adjust rotation if desired
        slideShadows: false, // Disable shadows for a cleaner look
    },
});


function updateStatsContent() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const stats = activeSlide ? activeSlide.getAttribute('data-stats') : '';
    document.getElementById('view-stats-collapse-id-content').textContent = stats;
}

function collapseViewStats() {
    // Only collapse if currently expanded
    const collapseEl = document.getElementById('view-stats-collapse-id');
    if (collapseEl.classList.contains('show')) {
        collapseEl.classList.remove('show');
    }
}

swiper.on('slideChange', function () {
    updateStatsContent();
    collapseViewStats();
});

// Initialize stats content on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStatsContent();
    console.log('Slide changed to index:', swiper.activeIndex);
});

// Ensure Swiper is available globally
window.swiper = swiper;