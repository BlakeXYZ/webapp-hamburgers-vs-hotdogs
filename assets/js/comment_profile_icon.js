import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';



document.querySelectorAll('.comment-profile-icon').forEach(function(el) {
    const session_ids = el.getAttribute('data-session-id');
    const avatar = createAvatar(thumbs, {
      seed: session_ids,
      "size": 48, 
      "scale": 75,
      "radius": 50,

    });

    el.innerHTML = avatar.toString();
});

const sessionId = localStorage.getItem('session_id');

const avatar = createAvatar(thumbs, {
  seed: sessionId,
  "size": 48, 
  "scale": 75,
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


// https://www.npmjs.com/package/unique-names-generator