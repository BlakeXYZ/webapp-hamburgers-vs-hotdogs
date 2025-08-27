function hasVisited() {
  let visited = localStorage.getItem('has_visited');
  if (!visited) {
    localStorage.setItem('has_visited', 'true');
    console.log("First visit detected.");
    document.cookie = "has_visited=false; path=/; max-age=3600";
    return false; // First visit
  }
  console.log("Has visited.");
  document.cookie = "has_visited=true; path=/; max-age=3600";
  return true; // Subsequent visits
}

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



// how to explicitly use hasVisited only for /home route
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname === '/') {
    hasVisited();
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