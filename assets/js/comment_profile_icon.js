import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';


const sessionId = localStorage.getItem('session_id');

const avatar = createAvatar(thumbs, {
  seed: sessionId,
  "scale": 70,
  "radius": 50,

});

const svg = avatar.toString();


// Inject SVG into an element with id 'profile-icon'
document.addEventListener('DOMContentLoaded', function() {
const iconContainer = document.querySelector('.profile-icon');
  if (iconContainer) {
    iconContainer.innerHTML = svg;
  }
});