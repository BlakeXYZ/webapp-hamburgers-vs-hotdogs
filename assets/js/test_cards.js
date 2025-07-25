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


// Ensure Swiper is available globally
window.swiper = swiper;