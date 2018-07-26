let async = require('async');
let referralDbo = require('../dbos/referral.dbo');
let { transfer } = require('./eth.helper');
let { CLIENT_BONUS,
  REFERRAL_BONUS,
  COINBASE_PRIVATE_KEY } = require('../../config/referral');


let transferAndUpdate = (address, toAddress, cb) => {
  let amount = address === toAddress ? CLIENT_BONUS : REFERRAL_BONUS;
  async.waterfall([
    (next) => {
      transfer(COINBASE_PRIVATE_KEY, toAddress, amount, 'SENT',
        (error, txHash) => {
          if (error) next({
            code: 201,
            message: 'Error occurred while transfering bonus.'
          });
          else next(null, txHash);
        }); /* next(null, Math.random().toString(36)); */
    }, (txHash, next) => {
      referralDbo.updateReferral(address,
        address === toAddress ? {
          clientTxHash: txHash,
          clientAmount: amount
        } : {
            referralTxHash: txHash,
            referralAmount: amount
          }, (error, result) => {
            if (error) next({
              code: 202,
              message: 'Error occured while updating tx hash.'
            });
            else next(null);
          });
    }
  ], (error) => {
    cb(error);
  });
};

module.exports = {
  transferAndUpdate
};
