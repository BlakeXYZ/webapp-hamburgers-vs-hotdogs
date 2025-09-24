import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';



function applyAvatarsToCommentIcons(root = document) {
  root.querySelectorAll('.comment-profile-icon').forEach(function(el) {
    if (el.getAttribute('data-avatar-applied')) return;
    const session_ids = el.getAttribute('data-session-id');
    const avatar = createAvatar(thumbs, {
      seed: session_ids,
      "size": 48, 
      "scale": 75,
      "radius": 50,
    });
    el.innerHTML = avatar.toString();
    el.setAttribute('data-avatar-applied', 'true');
  });
}

// Listen for dynamically added elements
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) { // ELEMENT_NODE
        if (node.classList.contains('comment-profile-icon')) {
          applyAvatarsToCommentIcons(node.parentNode);
        } else {
          applyAvatarsToCommentIcons(node);
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

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