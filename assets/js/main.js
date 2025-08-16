/*
 * Main Javascript file for webapp_hamburg_vs_hotdog.
 *
 * This file bundles all of your javascript together using webpack.
 */

// JavaScript modules
require("@fortawesome/fontawesome-free");
require("jquery");
require("bootstrap");

require.context(
  "../img", // context folder
  true, // include subdirectories
  /.*/, // RegExp
);

// Your own code
require("./plugins");
require("./script");
require('./test_vote.js');
require('./vote_confetti.js');
require('./vote_stats.js');
require('./vote_swiper.js');
