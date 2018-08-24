let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/account', accountValidation.addAccount, accountContoller.addAccount);

  server.put('/account', accountValidation.updateAccount, accountContoller.updateAccount);

  server.get('/account', accountValidation.getAccount, accountContoller.getAccount);

  server.get('/accounts', accountContoller.getAccounts);

  server.get('/dashboard', accountValidation.getDashBoard, accountContoller.getDashBoard);

  server.get('/leaderboard', accountContoller.getLeaderBoard);

  server.get('/leaderboard/vars', accountContoller.leaderVariable);

  server.get('/dashboard/vars', accountContoller.dashVariable);

};