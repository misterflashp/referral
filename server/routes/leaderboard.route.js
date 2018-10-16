let leaderboardController = require('../controllers/leaderboard.controller');

module.exports = (server) => {
  server.get('/leaderboard', leaderboardController.getLeaderBoard);
  // server.get('/leaderboard/v2', leaderboardController.getNewLeaderBoard);
};