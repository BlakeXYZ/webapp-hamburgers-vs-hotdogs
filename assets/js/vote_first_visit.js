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


// how to explicitly use hasVisited only for /home route
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname === '/') {
    hasVisited();
  }
});