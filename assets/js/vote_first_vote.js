function hideFirstVisitElements() {
  const pointer = document.getElementById('first-visit-pointer');
  const text = document.getElementById('first-visit-text');
  if (pointer) {
    pointer.style.display = 'none';
  }
  if (text) {
    text.style.visibility = 'hidden';
    text.style.pointerEvents = 'none';
  }
}


// Ensure session_id is set as a cookie for backend access
document.addEventListener('DOMContentLoaded', function() {
  const sessionId = localStorage.getItem('session_id');
  if (sessionId) {
    document.cookie = `session_id=${sessionId}; path=/; max-age=31536000`;
  }
});


// Listen for first vote button click
document.addEventListener('DOMContentLoaded', function() {
  const voteBtns = document.querySelectorAll('.vote-btn');
  voteBtns.forEach(btn => {
    btn.addEventListener('click', function handler(e) {
      hideFirstVisitElements();
      // Remove this handler from all vote buttons
      voteBtns.forEach(b => b.removeEventListener('click', handler));
    });
  });
});


