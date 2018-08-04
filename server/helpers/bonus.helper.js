let { transfer } = require('./eth.helper');
let { COINBASE_PRIVATE_KEY } = require('../../config/referral');


let transferBonus = (toAddress, amount, cb) => {
  transfer(COINBASE_PRIVATE_KEY, toAddress, amount, 'SENT',
    (error, txHash) => {
      if (error) cb({
        code: 201,
        message: 'Error occurred while transfering bonus.'
      });
      else cb(null, txHash);
    });
};

module.exports = {
  transferBonus
};