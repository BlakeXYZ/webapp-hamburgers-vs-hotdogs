// import Swiper JS
import Swiper from 'swiper/bundle';



var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,

    rewind: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    cardsEffect: {
        perSlideOffset: 85, // Increase for more left/right offset (default is 8)
        perSlideRotate: 0,
        rotate: true, // You can also adjust rotation if desired
    },



});


// Ensure Swiper is available globally
window.swiper = swiper;