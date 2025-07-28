import confetti from 'canvas-confetti';

var scalar = 2;
var blue = confetti.shapeFromText({ text: '💙', scalar });
var red = confetti.shapeFromText({ text: '❤️', scalar });

var defaults = {
  spread: 360,
  ticks: 60,
  gravity: 0,
  decay: 0.96,
  startVelocity: 5,
  scalar
};

function confetti_blue() {
  confetti({
    ...defaults,
    particleCount: 5,
    shapes: [blue],
    flat: true
  });
}

function confetti_red() {
  confetti({
    ...defaults,
    particleCount: 5,
    shapes: [red],
    flat: true
  });
}


export { confetti_blue, confetti_red };