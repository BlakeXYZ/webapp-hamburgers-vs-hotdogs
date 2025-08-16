// import { confetti_blue, confetti_red } from './vote_confetti.js';

// function getSessionId() {
//   let sessionId = localStorage.getItem('session_id');
//   if (!sessionId) {
//     sessionId = crypto.randomUUID(); // For modern browsers
//     localStorage.setItem('session_id', sessionId);
//   }
//   return sessionId;
// }

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

// function setupVoteButtons() {

//     const voteButtons = document.querySelectorAll('.vote-btn');

//     voteButtons.forEach(button => {
//         button.addEventListener('click', async function() {

//             const sessionId = getSessionId();
//             // const geoInfo = await getGeoIpInfo(); 
            
//             fetch('/on_click_vote/', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({
//                     matchup_id: this.dataset.matchupId,
//                     contestant_id: this.dataset.contestantId,
//                     session_id: sessionId,
//                     // region_code: geoInfo.region_code,
//                     // country_code: geoInfo.country_code,
//                 })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 // Update the vote counts in the DOM
//                 document.getElementById('total-votes-' + data.matchup_id).textContent =
//                     'Total Votes: ' + data.total_votes;
//                 // document.getElementById('votes-a-' + data.matchup_id).textContent =
//                 //     'Votes for ' + data.contestant_a_name + ': ' + data.votes_a;
//                 // document.getElementById('votes-b-' + data.matchup_id).textContent =
//                 //     'Votes for ' + data.contestant_b_name + ': ' + data.votes_b;
                

//                 // const msgDiv = document.getElementById('action-message-' + data.matchup_id);

//                 // // Update progress bars
//                 // document.querySelector(
//                 //     '#matchup-' + data.matchup_id + ' .progress-bar.bg-primary'
//                 // ).style.width = data.percent_a + '%';
//                 // document.querySelector(
//                 //     '#matchup-' + data.matchup_id + ' .progress-bar.bg-primary'
//                 // ).textContent = data.percent_a.toFixed(1) + '%';

//                 // document.querySelector(
//                 //     '#matchup-' + data.matchup_id + ' .progress-bar.bg-danger'
//                 // ).style.width = data.percent_b + '%';
//                 // document.querySelector(
//                 //     '#matchup-' + data.matchup_id + ' .progress-bar.bg-danger'
//                 // ).textContent = data.percent_b.toFixed(1) + '%';


//                 // // Optionally, update the action message
//                 // msgDiv.textContent = data.message;
//                 // msgDiv.style.opacity = 1;
//                 // setTimeout(() => {msgDiv.style.opacity = 0.2;}, 2000);

//                 // // Trigger confetti only if message does NOT contain "removed" and A is pressed
//                 // if (
//                 //     typeof data.message === 'string' &&
//                 //     !data.message.toLowerCase().includes('removed') &&
//                 //     this.classList.contains('bg-primary')
//                 // ) {
//                 //     console.log("Vote for A registered, firing confetti!");
//                 //     confetti_blue();
//                 // }
//                 // // Trigger confetti only if message does NOT contain "removed" and B is pressed
//                 // if (
//                 //     typeof data.message === 'string' &&
//                 //     !data.message.toLowerCase().includes('removed') &&
//                 //     this.classList.contains('bg-danger')
//                 // ) {
//                 //     console.log("Vote for B registered, firing confetti!");
//                 //     confetti_red();
//                 // }
//             });
//         });
//     });
// }

// // Call this on DOMContentLoaded or at the end of your JS file
// document.addEventListener('DOMContentLoaded', function() {
//     setupVoteButtons();
//     // Call other setup functions here as needed
// });
