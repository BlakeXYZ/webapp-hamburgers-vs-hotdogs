import { swiper } from './vote_swiper.js';
import { Collapse } from 'bootstrap';

function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // For modern browsers
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function statsContentVoteText(stats) {
    // Update the vote text with the percentage values
    return `
        <div id="total-votes-${stats.matchup_id}" class="text-center"><strong>Total Votes:</strong> ${stats.total_votes}</div>
    `;
}

function statsContentProgressBar(activeSlide, stats){

    const activeSlideMatchupContestantAColor = activeSlide.getAttribute('data-slide-matchup-contestant-a-color') || 'bg-primary';
    const activeSlideMatchupContestantBColor = activeSlide.getAttribute('data-slide-matchup-contestant-b-color') || 'bg-danger';

    console.log('activeSlideMatchupContestantAColor:', activeSlideMatchupContestantAColor);
    console.log('activeSlideMatchupContestantBColor:', activeSlideMatchupContestantBColor);

    // Update the progress bar with the percentage values
    return `
    <div class="progress" style="height: 2rem;">
        <div class="progress-bar progress-bar-striped progress-bar-animated ${activeSlideMatchupContestantAColor}" role="progressbar"
            style="width: ${stats.percent_a.toFixed(1)}%"
            aria-valuenow="${stats.percent_a}" aria-valuemin="0" aria-valuemax="100">
            ${stats.percent_a.toFixed(1)}%
        </div>
        <div class="progress-bar progress-bar-striped progress-bar-animated ${activeSlideMatchupContestantBColor}" role="progressbar"
            style="width: ${stats.percent_b.toFixed(1)}%"
            aria-valuenow="${stats.percent_b}" aria-valuemin="0" aria-valuemax="100">
            ${stats.percent_b.toFixed(1)}%
        </div>
    </div>
    `;

}


function updateStatsContent(retryCount = 0) {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const activeSlideMatchupId = activeSlide ? activeSlide.getAttribute('data-slide-matchup-id') : '';
    const statsContainer = document.getElementById('matchup-stats-collapse-content');
    const activeSlideMatchupContestantAColor = activeSlide.getAttribute('data-slide-matchup-contestant-a-color') || 'bg-primary';
    const activeSlideMatchupContestantBColor = activeSlide.getAttribute('data-slide-matchup-contestant-b-color') || 'bg-danger';

    if (!statsContainer) {
        if (retryCount < 10) {
            setTimeout(() => updateStatsContent(retryCount + 1), 100);
        }
        return;
    }
    if (activeSlideMatchupId && window.matchupStats && window.matchupStats[activeSlideMatchupId]) {
        const stats = window.matchupStats[activeSlideMatchupId];
        // Only update progress bar values if they exist
        const totalVotes = statsContainer.querySelector(`#total-votes-${stats.matchup_id}`);
        const barA = statsContainer.querySelector(`.progress-bar.${activeSlideMatchupContestantAColor}`);
        const barB = statsContainer.querySelector(`.progress-bar.${activeSlideMatchupContestantBColor}`);

        if (totalVotes) totalVotes.innerHTML = `<strong>Total Votes:</strong> ${stats.total_votes}`;

        if (barA && barB) {
            barA.style.width = stats.percent_a.toFixed(1) + '%';
            barA.textContent = stats.percent_a.toFixed(1) + '%';
            barB.style.width = stats.percent_b.toFixed(1) + '%';
            barB.textContent = stats.percent_b.toFixed(1) + '%';
        }
    } else {
        statsContainer.textContent = '';
    }
    console.log('active slide matchup id:', activeSlideMatchupId);
}

function initializeStatsContent( retryCount = 0 ) {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const activeSlideMatchupId = activeSlide ? activeSlide.getAttribute('data-slide-matchup-id') : '';
    const statsContainer = document.getElementById('matchup-stats-collapse-content');
    if (!statsContainer) {
        if (retryCount < 10) {
            setTimeout(() => updateStatsContent(retryCount + 1), 100);
        }
        return;
    }
    if (activeSlideMatchupId && window.matchupStats && window.matchupStats[activeSlideMatchupId]) {
        const stats = window.matchupStats[activeSlideMatchupId];
        statsContainer.innerHTML = `
            ${statsContentVoteText(stats)}
            ${statsContentProgressBar(activeSlide, stats)}
        `;

    } else {
        statsContainer.textContent = '';
    }
    console.log('active slide matchup id:', activeSlideMatchupId);
}


function setupVoteDelegation() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.addEventListener('click', async function(event) {
        const button = event.target.closest('.vote-btn');
        if (!button) return;

        // Prevent double submit
        if (button.disabled) return;
        button.disabled = true;

        const sessionId = getSessionId();
        const matchupId = button.dataset.matchupId;
        const contestantId = button.dataset.contestantId;

        try {
            const response = await fetch('/on_click_vote/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    matchup_id: matchupId,
                    contestant_id: contestantId,
                    session_id: sessionId,
                })
            });
            const data = await response.json();
            window.matchupStats[data.matchup_id] = data;
            updateStatsContent();
            initializeSlideVoteButtons();
            expandViewStats();
        } finally {
            button.disabled = false;
        }
    });
}

function initializeSlideVoteButtons() {
    // for each btn in active slide, fetch data-matchup-id
    // fetch window.matchupstats[session_id_matchup_vote_is]
    // if these match, please set button as active
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const voteButtons = activeSlide ? activeSlide.querySelectorAll('.vote-btn') : [];

    voteButtons.forEach(button => {
        const matchupId = button.dataset.matchupId;
        const contestantId = button.dataset.contestantId;
        const stats = window.matchupStats[matchupId];
        const sessionIdMatchupVoteIs = stats ? stats.session_id_matchup_vote_is : null;
        
        if (sessionIdMatchupVoteIs && sessionIdMatchupVoteIs == contestantId) {
            button.setAttribute('aria-pressed', 'true');
            button.classList.add('active');
            expandViewStats();
        } else {
            button.setAttribute('aria-pressed', 'false');
            button.classList.remove('active');
        }
    });
}

function expandViewStats() {
    const collapseContent = document.getElementById('matchup-stats-collapse');
    if (!collapseContent) return;
    const bsCollapse = Collapse.getOrCreateInstance(collapseContent);
    bsCollapse.show();
}

function collapseViewStats() {
    const collapseContent = document.getElementById('matchup-stats-collapse');
    collapseContent.classList.add('collapse');
    collapseContent.classList.remove('show');
}

swiper.on('slideChange', function () {
    initializeStatsContent();
    collapseViewStats();
    initializeSlideVoteButtons();
});

// Initialize stats content on page load
document.addEventListener('DOMContentLoaded', function() {
    const sessionId = getSessionId();
    fetch(`/api/matchup_stats/?session_id=${encodeURIComponent(sessionId)}`)
        .then(response => response.json())
        .then(data => {
            window.matchupStats = data;
            initializeStatsContent(10);
            initializeSlideVoteButtons();
            setupVoteDelegation();
            console.log('Slide changed to index:', swiper.activeIndex);
            console.log('============== Matchup stats loaded:', window.matchupStats);
        });
});