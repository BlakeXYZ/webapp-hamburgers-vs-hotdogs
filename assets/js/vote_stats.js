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

function updateStatsContent() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const activeSlideMatchupId = activeSlide ? activeSlide.getAttribute('data-slide-matchup-id') : '';
    const statsContainer = document.getElementById('matchup-stats-collapse-content');
    if (activeSlideMatchupId && window.matchupStats && window.matchupStats[activeSlideMatchupId]) {
        const stats = window.matchupStats[activeSlideMatchupId];
        statsContainer.innerHTML = `
            <div id="total-votes-${stats.matchup_id}"><strong>Total Votes:</strong> ${stats.total_votes}</div>
            <div id="votes-a-${stats.matchup_id}"><strong>Votes for ${stats.contestant_a_name}:</strong> ${stats.votes_a} (${stats.percent_a.toFixed(1)}%)</div>
            <div id="votes-b-${stats.matchup_id}"><strong>Votes for ${stats.contestant_b_name}:</strong> ${stats.votes_b} (${stats.percent_b.toFixed(1)}%)</div>
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
        const sessionId = getSessionId();
        console.log('Checking button for matchup:', matchupId, 'contestant id:', contestantId, 'session:', sessionId);

        const stats = window.matchupStats[matchupId];

        console.log('Stats for matchup:', stats);

        const sessionIdMatchupVoteIs = stats ? stats.session_id_matchup_vote_is : null;
        console.log('Session ID Matchup Vote Is:', sessionIdMatchupVoteIs);
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
    updateStatsContent();
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
            updateStatsContent();
            initializeSlideVoteButtons();
            setupVoteDelegation();
            console.log('Slide changed to index:', swiper.activeIndex);
            console.log('============== Matchup stats loaded:', window.matchupStats);
        });
});