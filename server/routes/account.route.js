let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/account', accountValidation.addAccount, accountContoller.addAccount);

  server.put('/account', accountValidation.updateAccount, accountContoller.updateAccount);

  server.get('/account', accountValidation.getAccount, accountContoller.getAccount);
};