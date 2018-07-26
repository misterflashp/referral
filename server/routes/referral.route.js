let referralContoller = require('../controllers/referral.controller');
let referralValidation = require('../validations/referral.validation');


module.exports = (server) => {
  server.post('/referral', referralValidation.addReferral, referralContoller.addReferral);

  server.get('/referral/info', referralValidation.getReferralInfo, referralContoller.getReferralInfo);

  server.post('/referral/claim', referralValidation.claimBonus, referralContoller.claimBonus);
};