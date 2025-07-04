
    
function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // For modern browsers
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function getGeoIpInfo() {
    return fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => ({
            region_code: data.region_code,
            country_code: data.country_code
        }));
}


function setupVoteButtons() {

    const voteButtons = document.querySelectorAll('.vote-btn');

    voteButtons.forEach(button => {
        button.addEventListener('click', async function() {

            const sessionId = getSessionId();
            const geoInfo = await getGeoIpInfo();

            // console.log('Button clicked', this.dataset);
            // console.log('Session ID:', sessionId);
            // console.log('Geo Info:', geoInfo);
            
            fetch('/on_click_vote/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    matchup_id: this.dataset.matchupId,
                    contestant_id: this.dataset.contestantId,
                    session_id: sessionId,
                    region_code: geoInfo.region_code,
                    country_code: geoInfo.country_code,
                })
            })
            .then(response => response.json())
            .then(data => {
                // Update the vote counts in the DOM
                document.getElementById('total-votes-' + data.matchup_id).textContent =
                    'Total Votes: ' + data.total_votes;
                document.getElementById('votes-a-' + data.matchup_id).textContent =
                    'Votes for ' + data.contestant_a_name + ': ' + data.votes_a;
                document.getElementById('votes-b-' + data.matchup_id).textContent =
                    'Votes for ' + data.contestant_b_name + ': ' + data.votes_b;
            });
        });
    });
}

// Call this on DOMContentLoaded or at the end of your JS file
document.addEventListener('DOMContentLoaded', function() {
    setupVoteButtons();
    // Call other setup functions here as needed
});