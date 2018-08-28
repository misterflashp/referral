let LeaderboardController = require('../controllers/leaderboard.controller');
module.exports = (server) => {
 
  
  server.get('/leaderboard', LeaderboardController.getLeaderBoard);

};