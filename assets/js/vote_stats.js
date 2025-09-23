import { swiper } from './vote_swiper.js';
import { Collapse } from 'bootstrap';
import { Chart } from 'chart.js/auto';

// function getGeoIpInfo() {
//     const cacheKey = 'geoip_info';
//     const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours in ms

//     // Try to get cached value
//     const cached = localStorage.getItem(cacheKey);
//     if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         if (Date.now() - timestamp < cacheTTL) {
//             return Promise.resolve(data);
//         }
//     }

//     // If not cached or expired, fetch and cache
//     return fetch('https://ipapi.co/json/')
//         .then(response => response.json())
//         .then(data => {
//             const geo = {
//                 region_code: data.region_code,
//                 country_code: data.country_code
//             };
//             localStorage.setItem(cacheKey, JSON.stringify({ data: geo, timestamp: Date.now() }));
//             return geo;
//         });
// }

// import { confetti_blue, confetti_red } from './vote_confetti.js';
// function launchConfetti() {
//     // Trigger confetti only if message does NOT contain "removed" and A is pressed
//     if (
//         typeof data.message === 'string' &&
//         !data.message.toLowerCase().includes('removed') &&
//         this.classList.contains('bg-primary')
//     ) {
//         console.log("Vote for A registered, firing confetti!");
//         confetti_blue();
//     }
//     // Trigger confetti only if message does NOT contain "removed" and B is pressed
//     if (
//         typeof data.message === 'string' &&
//         !data.message.toLowerCase().includes('removed') &&
//         this.classList.contains('bg-danger')
//     ) {
//         console.log("Vote for B registered, firing confetti!");
//         confetti_red();
//     }
// }

// Doughnut chart rendering logic with dummy data
function renderDoughnutChart(stats) {

    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const activeSlideMatchupId = activeSlide ? activeSlide.getAttribute('data-slide-matchup-id') : '';
    const statsContainer = document.getElementById('matchup-stats-collapse-content');
    const activeSlideMatchupContestantAColor = activeSlide.getAttribute('data-slide-matchup-contestant-a-color') || 'bg-primary';
    const activeSlideMatchupContestantBColor = activeSlide.getAttribute('data-slide-matchup-contestant-b-color') || 'bg-danger';

    const data = {
        labels: [
            stats.contestant_b_name,
            stats.contestant_a_name
        ],
        datasets: [{
            label: 'Votes',
            data: [stats.votes_b, stats.votes_a],
            backgroundColor: [
                getComputedStyle(activeSlide).getPropertyValue('--bs-' + activeSlideMatchupContestantBColor.replace('bg-', '')) || '#dc3545',
                getComputedStyle(activeSlide).getPropertyValue('--bs-' + activeSlideMatchupContestantAColor.replace('bg-', '')) || '#0d6efd'
            ],
            hoverOffset: 4
        }]
    };

    // Remove any existing chart instance to avoid duplicates
    if (window.doughnutChartInstance) {
        window.doughnutChartInstance.destroy();
    }

    const ctx = document.getElementById('acquisitions');
    if (ctx) {
        window.doughnutChartInstance = new Chart(
            ctx,
            {
                type: 'doughnut',
                data: data,
                options: {
                    rotation: 0,
                    plugins: {
                        legend: {
                            display: false // Hide legend
                        }
                    }
                }
            }

        );
    }
}

function statsContentDoughnutChart() {
    return `<div class="doughnut-chart-container"><canvas id="acquisitions"></canvas></div>`;
}

function updateStatsDoughtnutChart() {
    const slides = document.querySelectorAll('.swiper-slide');
    const activeSlide = slides[swiper.activeIndex];
    const activeSlideMatchupId = activeSlide ? activeSlide.getAttribute('data-slide-matchup-id') : '';
    const statsContainer = document.getElementById('matchup-stats-collapse-content');
    const activeSlideMatchupContestantAColor = activeSlide.getAttribute('data-slide-matchup-contestant-a-color') || 'bg-primary';
    const activeSlideMatchupContestantBColor = activeSlide.getAttribute('data-slide-matchup-contestant-b-color') || 'bg-danger';
    
    if (activeSlideMatchupId && window.matchupStats && window.matchupStats[activeSlideMatchupId]) {
        const stats = window.matchupStats[activeSlideMatchupId];
        const chart = window.doughnutChartInstance;
        const data = {
            labels: [
                stats.contestant_b_name,
                stats.contestant_a_name
            ],
            datasets: [{
                label: 'Votes',
                data: [stats.votes_b, stats.votes_a],
                backgroundColor: [
                    getComputedStyle(activeSlide).getPropertyValue('--bs-' + activeSlideMatchupContestantBColor.replace('bg-', '')) || '#dc3545',
                    getComputedStyle(activeSlide).getPropertyValue('--bs-' + activeSlideMatchupContestantAColor.replace('bg-', '')) || '#0d6efd'
                ],
                hoverOffset: 4
            }]
        };

        if (chart) {
            chart.data.datasets[0].data = data.datasets[0].data;
            chart.data.datasets[0].backgroundColor = data.datasets[0].backgroundColor;
            // If you want to update labels:
            chart.data.labels = data.labels;
            chart.update();
        }
    }
}


function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // For modern browsers
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}


function statsContentTotalVotesText(stats) {
    // Update the vote text with the percentage values
    return `
        <div id="total-votes-${stats.matchup_id}" class="text-center mb-2"><strong>Total Votes:</strong> ${stats.total_votes}</div>
    `;
}

function statsContentVotesForText(stats) {
    return `
        <div class="d-flex justify-content-between mb-2 gap-2">
            <div id="votes-a-${stats.matchup_id}" class="text-center flex-fill">
                <strong>Votes for ${stats.contestant_a_name}:</strong> ${stats.votes_a}
            </div>
            <div id="votes-b-${stats.matchup_id}" class="text-center flex-fill">
                <strong>Votes for ${stats.contestant_b_name}:</strong> ${stats.votes_b}
            </div>
        </div>
    `;
}

function statsContentProgressBar(activeSlide, stats){

    const activeSlideMatchupContestantAColor = activeSlide.getAttribute('data-slide-matchup-contestant-a-color') || 'bg-primary';
    const activeSlideMatchupContestantBColor = activeSlide.getAttribute('data-slide-matchup-contestant-b-color') || 'bg-danger';

    // console.log('activeSlideMatchupContestantAColor:', activeSlideMatchupContestantAColor);
    // console.log('activeSlideMatchupContestantBColor:', activeSlideMatchupContestantBColor);

    // Update the progress bar with the percentage values
    return `
    <div class="progress mb-2" style="height: 2rem;">
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
        const votesA = statsContainer.querySelector(`#votes-a-${stats.matchup_id}`);
        const votesB = statsContainer.querySelector(`#votes-b-${stats.matchup_id}`);
        const barA = statsContainer.querySelector(`.progress-bar.${activeSlideMatchupContestantAColor}`);
        const barB = statsContainer.querySelector(`.progress-bar.${activeSlideMatchupContestantBColor}`);

        if (totalVotes) totalVotes.innerHTML = `<strong>Total Votes:</strong> ${stats.total_votes}`;
        if (votesA) votesA.innerHTML = `<strong>Votes for ${stats.contestant_a_name}:</strong> ${stats.votes_a}`;
        if (votesB) votesB.innerHTML = `<strong>Votes for ${stats.contestant_b_name}:</strong> ${stats.votes_b}`;

        if (barA && barB) {
            barA.style.width = stats.percent_a.toFixed(1) + '%';
            barA.textContent = stats.percent_a.toFixed(1) + '%';
            barB.style.width = stats.percent_b.toFixed(1) + '%';
            barB.textContent = stats.percent_b.toFixed(1) + '%';
        }
    } else {
        statsContainer.textContent = '';
    }
    // console.log('active slide matchup id:', activeSlideMatchupId);
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
            ${statsContentTotalVotesText(stats)}
            ${statsContentProgressBar(activeSlide, stats)}
            ${statsContentVotesForText(stats)}
            ${statsContentDoughnutChart()}
        `;
        renderDoughnutChart(stats);

    } else {
        statsContainer.textContent = '';
    }
    // console.log('active slide matchup id:', activeSlideMatchupId);
}


function setupVoteDelegation() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return;
    swiperWrapper.addEventListener('click', async function(event) {
        const button = event.target.closest('.vote-btn');
        if (!button) return;

        // Prevent double submit
        if (button.disabled) return;
        button.disabled = true;

        const sessionId = getSessionId();
        const matchupId = button.dataset.matchupId;
        const contestantId = button.dataset.contestantId;
        // const geoInfo = await getGeoIpInfo();

        try {
            const response = await fetch('/on_click_vote/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    matchup_id: matchupId,
                    contestant_id: contestantId,
                    session_id: sessionId,
                    // region_code: geoInfo.region_code,
                    // country_code: geoInfo.country_code,
                })
            });
            const data = await response.json();
            window.matchupStats[data.matchup_id] = data;
            updateStatsContent();
            updateStatsDoughtnutChart();
            initializeSlideVoteButtons();
            expandViewStats();
        } finally {
            button.disabled = false;
        }
    });
}

function setupCollapseMatchupBtnListener() {
    const collapseMatchupBtn = document.querySelector('.btn-matchup-stats');
    if (!collapseMatchupBtn) return;

    collapseMatchupBtn.addEventListener('click', function() {
        if (this.getAttribute('aria-expanded') === 'true') {
            // Currently expanded, so collapse
            collapseMatchupBtn.textContent = 'Hide Stats';
        } else {
            // Currently collapsed, so expand
            collapseMatchupBtn.textContent = 'View Stats';
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

    const collapseMatchupBtn = document.querySelector('.btn-matchup-stats');
    collapseMatchupBtn.textContent = 'Hide Stats';
 
}

function collapseViewStats() {
    const collapseContent = document.getElementById('matchup-stats-collapse');
    if (!collapseContent) return;
    collapseContent.classList.add('collapse');
    collapseContent.classList.remove('show');

    const collapseMatchupBtn = document.querySelector('.btn-matchup-stats');
    collapseMatchupBtn.textContent = 'View Stats';

}

swiper.on('slideChange', function () {
    initializeStatsContent();
    collapseViewStats();
    initializeSlideVoteButtons();
});

// Initialize stats content on page load
document.addEventListener('DOMContentLoaded', function() {
    const sessionId = getSessionId();
    const collapseMatchupBtn = document.querySelector('.btn-matchup-stats');
    fetch(`/api/matchup_stats/?session_id=${encodeURIComponent(sessionId)}`)
        .then(response => response.json())
        .then(data => {
            window.matchupStats = data;
            initializeStatsContent(10);
            initializeSlideVoteButtons();
            setupVoteDelegation();
            setupCollapseMatchupBtnListener();
            // console.log('Slide changed to index:', swiper.activeIndex);
            // console.log('============== Matchup stats loaded:', window.matchupStats);
        });
});