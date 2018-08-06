let bonusContoller = require('../controllers/bonus.controller');
let bonusValidation = require('../validations/bonus.validation');


module.exports = (server) => {
  server.post('/bonus/claim', bonusValidation.bonusClaim, bonusContoller.bonusClaim);

  server.get('/bonus/info', bonusValidation.getBonusInfo, bonusContoller.getBonusInfo);
};
