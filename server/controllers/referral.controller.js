let async = require('async');
let referralDbo = require('../dbos/referral.dbo');
let { getTxReceipt } = require('../helpers/eth.helper');
let { transferAndUpdate } = require('../helpers/referral.helper');

/**
* @api {post} /referral To add referral address.
* @apiName addReferral
* @apiGroup Referral
* @apiParam {String} clientAddress Address of client.
  @apiParam {String} referralAddress Referrer address which is valid.
* @apiError ClientAddressSameAsReferralAddress Client cannot add his own address as referral address
* @apiErrorExample ClientAddressSameAsReferralAddress:
* {
*   success: false,
*   message: 'Client address and Referral address should not be same.'
* }
* @apiError ClientAddressAlreadyExists Provided address already exists 
* @apiErrorExample ClientAddressAlreadyExists-Response:
* {
*   success: false,
*   message: 'Client address is already exists.'
* }
* @apiError ReferralAddressNotExists Provided referral address already exists 
* @apiErrorExample ReferralAddressNotExists-Response:
* {
*   success: false,
*   message: 'Referral address is not exist.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Referral address added successfully.'
* }
*/
let addReferral = (req, res) => {
  let { clientAddress,
    referralAddress } = req.body;
  clientAddress = clientAddress.toLowerCase();
  referralAddress = referralAddress.toLowerCase();
  async.waterfall([
    (next) => {
      if (clientAddress === referralAddress) next({
        status: 400,
        message: 'Client address and Referral address should not be same.'
      });
      else next(null);
    }, (next) => {
      referralDbo.getReferral(clientAddress,
        (error, referral) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking client address.'
          }, null);
          else if (referral) next({
            status: 400,
            message: 'Client address is already exists.'
          }, null);
          else next(null);
        });
    }, (next) => {
      referralDbo.getReferral(referralAddress,
        (error, referral) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking referral address.'
          }, null);
          else if (referral) next(null);
          else next({
            status: 400,
            message: 'Referral address is not exist.'
          }, null);
        });
    }, (next) => {
      referralDbo.addReferral({
        clientAddress,
        referralAddress
      }, (error, result) => {
        console.log(error);
        if (error) next({
          status: 500,
          message: 'Error occurred while adding referral address.'
        }, null);
        else next(null, {
          status: 200,
          message: 'Referral address added successfully.'
        });
      });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

/**
* @api {get} /referral/info To get referral information.
* @apiName getReferralInfo
* @apiGroup Referral
* @apiParam {String} address Address of client.
* @apiError NoReferralAddressExists No one used this client address as referral address
* @apiErrorExample NoReferralAddressExists-Response:
* {
*   success: false,
*   message: 'No referral address exists.'
* }
* @apiSuccess {Boolean} isClaimed Status of claim
* @apiSuccess {Number} joinBonus Referral amount earned
* @apiSuccess {Object} referral Information about referral earnings.
* @apiSuccessExample Response:
* {
*   success: true,
*   isClaimed: true,
*   joinBonus: 20000000000,
*   referral: {
*       count: 4,
*       amount: 40000000000
*   }
* }
*/
let getReferralInfo = (req, res) => {
  let { address } = req.query;
  address = address.toLowerCase();
  let info = {};
  async.waterfall([
    (next) => {
      referralDbo.getReferral(address,
        (error, referral) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking referral address.'
          }, null);
          else if (referral) next(null, referral);
          else next({
            status: 400,
            message: 'No referral address exists.'
          }, null);
        });
    }, (referral, next) => {
      let { clientTxHash,
        clientAmount } = referral;
      info.isClaimed = clientTxHash ? true : false;
      info.joinBonus = clientAmount;
      referralDbo.getTotalReferralBonus(address,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting referral bonus value.'
          }, null);
          else {
            info.referral = result;
            next(null, Object.assign({
              status: 200
            }, info));
          }
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};


/**
* @api {post} /referral/claim To claim referral bonus.
* @apiName claimBonus
* @apiGroup Referral
* @apiParam {String} address Address of client.
* @apiError NoReferralAddressExists No one used this client address as referral address
* @apiErrorExample NoReferralAddressExists-Response:
* {
*   success: false,
*   message: 'No referral address exists.'
* }
* @apiError BonusAlreadyClaimed Provided address already claimed for bonus 
* @apiErrorExample BonusAlreadyClaimed-Response:
* {
*   success: false,
*   message: 'Bonus already claimed.'
* }
* @apiError PaymentTxNotFound Provided address not made first payment yet. 
* @apiErrorExample PaymentTxNotFound-Response:
* {
*   success: false,
*   message: 'Payment tx hash not found.'
* }
* @apiSuccessExample Response:
* {
*   success: true,
*   message: 'Bonus claimed successfully.'
* }
*/
let claimBonus = (req, res) => {
  let { address } = req.body;
  address = address.toLowerCase();
  let details = null;
  async.waterfall([
    (next) => {
      referralDbo.getReferral(address,
        (error, referral) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking referral address.'
          }, null);
          else if (referral) {
            details = referral;
            next(null);
          } else next({
            status: 400,
            message: 'No referral address exists.'
          }, null);
        });
    }, (next) => {
      let { clientTxHash,
        referralTxHash } = details;
      if (clientTxHash && referralTxHash) next({
        status: 400,
        message: 'Bonus already claimed.'
      }, null);
      else next(null);
    }, (next) => {
      let { paymentTxHash } = details;
      if (paymentTxHash) {
        getTxReceipt(paymentTxHash,
          (error, receipt) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while getting tx.'
            }, null);
            else if (receipt && receipt.status === 1) next(null);
            else next({
              status: 400,
              message: 'Tx receipt is not found or failed tx.'
            }, null);
          });
      } else next({
        status: 400,
        message: 'Payment tx hash not found.'
      }, null);
    }, (next) => {
      let { referralTxHash,
        referralAddress } = details;
      if (!referralTxHash) transferAndUpdate(address, referralAddress,
        (error) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while transfering bonus.'
          }, null);
          else next(null);
        });
      else next(null);
    }, (next) => {
      let { clientTxHash,
        clientAddress } = details;
      if (!clientTxHash) transferAndUpdate(address, clientAddress,
        (error) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while transfering bonus.'
          }, null);
          else next(null);
        });
      else next(null);
    }, (next) => {
      next(null, {
        status: 200,
        message: 'Bonus claimed successfully.'
      });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

module.exports = {
  addReferral,
  claimBonus,
  getReferralInfo
};
