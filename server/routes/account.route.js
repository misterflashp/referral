let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/accounts', accountValidation.addAccount, accountContoller.addAccount);

  server.put('/accounts/:deviceId', accountValidation.updateAccount, accountContoller.updateAccount);

  server.get('/accounts/:type/:value', accountValidation.getAccount, accountContoller.getAccount);

  server.get('/accounts', accountContoller.getAccounts);
  
  server.post('/accounts/link/:sncRefId/:slcRefId', accountValidation.linkAccounts, accountContoller.linkAccounts);

  server.post('/accounts/:deviceId/bonuses', accountValidation.addBonus, accountContoller.addBonus);

  server.get('/accounts/:deviceId/bonuses/info', accountValidation.getBonuses, accountContoller.getBonuses);

  // server.post('/accounts/:deviceId/bonuses/claim', accountValidation.bonusClaim, accountContoller.bonusClaim);
};