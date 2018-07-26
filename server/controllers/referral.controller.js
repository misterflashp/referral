let async = require('async');
let crc = require('crc');
let referralDbo = require('../dbos/referral.dbo');
let { getTxReceipt } = require('../helpers/eth.helper');
let { transferAndUpdate } = require('../helpers/referral.helper');

/**
* @api {post} /referral To add referral address.
* @apiName addReferral
* @apiGroup Referral
* @apiParam {String} clientAddress Address of client.
  @apiParam {String} referralId Referral ID which is valid.
* @apiError ClientAddressAlreadyExists Provided address already exists 
* @apiErrorExample ClientAddressAlreadyExists-Response:
* {
*   success: false,
*   message: 'Client address is already exists.'
* }
* @apiError ReferralIdNotExists Provided referral ID not exists 
* @apiErrorExample ReferralIdNotExists-Response:
* {
*   success: false,
*   message: 'Referral ID is not exist.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Referral ID added successfully.'
* }
*/
let addReferral = (req, res) => {
  let { clientAddress,
    referralId } = req.body;
  clientAddress = clientAddress.toLowerCase();
  async.waterfall([
    (next) => {
      referralDbo.getReferralInfo({ clientAddress },
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
      referralDbo.getReferralInfo({
        'clientReferralId': referralId
      }, (error, referral) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while checking referral ID.'
        }, null);
        else if (referral) next(null);
        else next({
          status: 400,
          message: 'Referral ID is not exist.'
        }, null);
      });
    }, (next) => {
      let clientReferralId = crc.crc32(Buffer.from(clientAddress.slice(2), 'hex')).toString(16);
      referralDbo.addReferral({
        clientReferralId,
        clientAddress,
        referralId
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while adding referral address.'
        }, null);
        else next(null, {
          status: 200,
          message: 'Referral ID added successfully.'
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
* @apiParam {String} clientReferralId Referral ID of client.
* @apiError NoReferralIdExists No referral id exists 
* @apiErrorExample NoReferralIdExists-Response:
* {
*   success: false,
*   message: 'No address exists.'
* }
* @apiSuccess {Boolean} isClaimed Status of claim
* @apiSuccess {Number} joinBonus Referral amount earned
* @apiSuccess {Object} referral Information about referral earnings.
* @apiSuccessExample Response:
* {
*   success: true,
*   isClaimed: true,
*   joinBonus: 20000000000,
*   clientReferralId: Referral ID
*   referral: {
*       count: 4,
*       amount: 40000000000
*   }
* }
*/
let getReferralInfo = (req, res) => {
  let { clientReferralId } = req.query;
  let info = {};
  async.waterfall([
    (next) => {
      referralDbo.getReferralInfo({
        'clientReferralId': clientReferralId
      }, (error, referral) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while checking referral ID.'
        }, null);
        else if (referral) next(null, referral);
        else next({
          status: 400,
          message: 'No referral ID exists.'
        }, null);
      });
    }, (referral, next) => {
      let { clientTxHash,
        clientAmount,
        clientReferralId } = referral;
      info.isClaimed = clientTxHash ? true : false;
      info.clientReferralId = clientReferralId;
      info.joinBonus = clientAmount;
      referralDbo.getTotalReferralBonus(clientReferralId,
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
* @apiParam {String} clientReferralId Referral ID of client.
* @apiError NoReferralIdExists No referral id exists 
* @apiErrorExample NoReferralIdExists-Response:
* {
*   success: false,
*   message: 'No referral ID exists.'
* }
* @apiError BonusAlreadyClaimed Provided client already claimed for bonus 
* @apiErrorExample BonusAlreadyClaimed-Response:
* {
*   success: false,
*   message: 'Bonus already claimed.'
* }
* @apiError PaymentTxNotFound Provided client not made first payment yet. 
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
  let { clientReferralId } = req.body;
  let details = null;
  async.waterfall([
    (next) => {
      referralDbo.getReferralInfo({
        'clientReferralId': clientReferralId
      }, (error, referral) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while checking referral ID.'
        }, null);
        else if (referral) {
          details = referral;
          next(null);
        } else next({
          status: 400,
          message: 'No referral ID exists.'
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
        console.log(paymentTxHash);
        getTxReceipt(paymentTxHash,
          (error, receipt) => {
            console.log(error, receipt.status);
            if (error) next({
              status: 500,
              message: 'Error occurred while getting tx.'
            }, null);
            else if (receipt && parseInt(receipt.status.toString(10)) === 1) next(null);
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
      let { referralId } = details;
      referralDbo.getReferralInfo({
        'clientReferralId': referralId
      }, (error, response) => {
        if (error) {
          next({
            status: 500,
            message: 'Error occurred while getting referral address.'
          }, null);
        } else if (response) {
          details.referralAddress = response.clientAddress;
          next(null);
        } else {
          next({
            status: 400,
            message: 'No referral address found'
          }, null);
        }
      });
    }, (next) => {
      let { referralTxHash,
        referralAddress,
        clientAddress } = details;
      if (!referralTxHash) transferAndUpdate(clientAddress, referralAddress,
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
      if (!clientTxHash) transferAndUpdate(clientAddress, clientAddress,
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
  getReferralInfo,
};
