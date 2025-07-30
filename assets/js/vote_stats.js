import { swiper } from './vote_swiper.js';

function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // For modern browsers
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function setupSlideVoteButtons() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const voteButtons = activeSlide ? activeSlide.querySelectorAll('.vote-btn') : [];

    voteButtons.forEach(button => {
        button.addEventListener('click', async function() {

            const sessionId = getSessionId();
            // const geoInfo = await getGeoIpInfo(); 
            
            fetch('/on_click_vote/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    matchup_id: this.dataset.matchupId,
                    contestant_id: this.dataset.contestantId,
                    session_id: sessionId,
                    // region_code: geoInfo.region_code,
                    // country_code: geoInfo.country_code,
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Vote response:', data);




                //TODO: Handle View Stats Window update on vote click + slide change
                
                //TODO: Handle Toggle vote when switching contestants

                // // Update the vote counts in the DOM
                // document.getElementById('total-votes-' + data.matchup_id).textContent =
                //     'Total Votes: ' + data.total_votes;
                //  document.getElementById('votes-a-' + data.matchup_id).textContent =
                //      'Votes for ' + data.contestant_a_name + ': ' + data.votes_a;
                //  document.getElementById('votes-b-' + data.matchup_id).textContent =
                //      'Votes for ' + data.contestant_b_name + ': ' + data.votes_b;



            });
        });
    });
}

function updateStatsContent() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const stats = activeSlide ? activeSlide.getAttribute('data-stats') : '';
    document.getElementById('matchup-stats-collapse-content').textContent = stats;
    console.log('active slide stats:', stats);
}

function collapseViewStats() {
    const collapseContent = document.getElementById('matchup-stats-collapse');
    collapseContent.classList.add('collapse');
    collapseContent.classList.remove('show');
}

swiper.on('slideChange', function () {
    updateStatsContent();
    collapseViewStats();
    setupSlideVoteButtons();
});

// Initialize stats content on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStatsContent();
    setupSlideVoteButtons();
    console.log('Slide changed to index:', swiper.activeIndex);
});