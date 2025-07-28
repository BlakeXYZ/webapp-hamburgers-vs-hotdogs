import { swiper } from './vote_swiper.js';

function updateStatsContent() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const stats = activeSlide ? activeSlide.getAttribute('data-stats') : '';
    document.getElementById('matchup-stats-collapse-content').textContent = stats;
}

function collapseViewStats() {
    const collapseContent = document.getElementById('matchup-stats-collapse');
    collapseContent.classList.add('collapse');
    collapseContent.classList.remove('show');
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