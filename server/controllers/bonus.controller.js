let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let bonusHelper = require('../helpers/bonus.helper');
let { CLAIM_AFTER,
  REF_BONUS,
  SLC_BONUS } = require('../../config/referral');


let addRefBonus = (referralId, _deviceId, cb) => {
  let deviceId = null;
  let refBonusesInfo = null;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ referralId },
        (error, account) => {
          if (error) next(error);
          else {
            deviceId = account.deviceId;
            next(null);
          }
        });
    }, (next) => {
      bonusDbo.getBonuses(deviceId,
        (error, bonuses) => {
          if (error) next(error);
          else {
            refBonusesInfo = bonuses.refBonusesInfo;
            next(null);
          }
        });
    }, (next) => {
      if (!refBonusesInfo.filter((e) => e.deviceId === _deviceId).length) {
        bonusDbo.addBonus(deviceId, 'REF', {
          deviceId: _deviceId,
          amount: REF_BONUS,
          txHash: null,
          onDate: new Date(),
        }, (error, result) => {
          if (error) next(error);
          else next(null);
        });
      } else next(null);
    }
  ], (error) => cb(error));
};

let addBonus = (req, res) => {
  let { deviceId } = req.body;
  let referredBy = null;
  let bonuses = null;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          });
          else if (account) {
            referredBy = account.referredBy;
            next(null);
          } else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (next) => {
      bonusDbo.getBonuses(deviceId,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting bonuses.'
          });
          else {
            bonuses = result;
            next(null);
          }
        });
    }, (next) => {
      let { slcBonusesInfo } = bonuses;
      if (slcBonusesInfo.length) next(null);
      else {
        bonusDbo.addBonus(deviceId, 'SLC', {
          amount: SLC_BONUS,
          txHash: null,
          onDate: new Date()
        }, (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding bonus.'
          });
          else next(null);
        });
      }
    }, (next) => {
      if (referredBy) {
        addRefBonus(referredBy, deviceId,
          (error) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while adding referral bonus.'
            });
            else next(null, {
              status: 200,
              message: 'Bonus added successfully.'
            });
          });
      } else next(null, {
        status: 200,
        message: 'Bonus added successfully.'
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
* @api {get} /bonus/claim To claim bonus.
* @apiName bonusClaim
* @apiGroup Bonus
* @apiParam {String} deviceId Device ID of client.
* @apiError DeviceNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
* }
* @apiError NoAccountAddressExists No account address attached for provided deviceId. 
* @apiErrorExample NoAccountAddressExists-Response:
* {
*   success: false,
*   message: 'No account address exists.'
* }
* @apiError BonusAlreadyClaimedOrNoBonusToClaim Bonus already claimed OR no bonuses to claim. 
* @apiErrorExample BonusAlreadyClaimedOrNoBonusToClaim-Response:
* {
*   success: false,
*   message: 'Bonus already claimed OR no bonuses to claim.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Bonus claimed successfully.'
* }
*/
let bonusClaim = (req, res) => {
  let { deviceId } = req.body;
  let address = null;
  let referredBy = null;
  async.waterfall([
    (next) => {
      if (new Date() <= CLAIM_AFTER) next({
        status: 400,
        message: 'You can\'t claim bonus now.'
      });
      else next(null);
    }, (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          });
          else if (account) {
            address = account.address;
            referredBy = account.referredBy;
            next(null);
          } else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (next) => {
      if (address) next(null);
      else next({
        status: 400,
        message: 'No account address exists.'
      });
    }, (next) => {
      if (referredBy) next(null);
      else next({
        status: 400,
        message: 'No referred by exists.'
      });
    }, (next) => {
      bonusDbo.getBonuses(deviceId,
        (error, bonuses) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting bonuses.'
          });
          else next(null, bonuses);
        });
    }, (bonuses, next) => {
      let { refBonusesInfo,
        slcBonusesInfo } = bonuses;
      let amount = lodash.sum(lodash.map(refBonusesInfo.filter((e) => !e.txHash), 'amount'));
      if (slcBonusesInfo.length && !slcBonusesInfo[0].txHash) amount += slcBonusesInfo[0].amount;
      if (amount === 0) next({
        status: 400,
        message: 'No bonus amount to claim.'
      });
      else next(null, amount);
    }, (amount, next) => {
      bonusHelper.transferBonus(address, amount,
        (error, txHash) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while transferring bonus.'
          });
          else next(null, txHash);
        });
    }, (txHash, next) => {
      bonusDbo.updateBonusInfo(deviceId, txHash,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while updating bonus status.'
          });
          else next(null, {
            status: 200,
            message: 'Bonus claimed successfully.'
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
* @api {get} /bonus/info To get bonus information.
* @apiName getBonusInfo
* @apiGroup Bonus
* @apiParam {String} deviceId Device ID of client.
* @apiError DeviceNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   bonuses: {
*     snc: Number,
*     slc: Number,
*     ref: Number
*   },
*   refCount: Number,
*   canClaim: Boolean,
*   canClaimAfter: Date
* }
*/
let getBonusInfo = (req, res) => {
  let { deviceId } = req.query;
  let referrals = [];
  let referralId = null;
  let referredBy = null;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          });
          else if (account) {
            referralId = account.referralId;
            referredBy = account.referredBy;
            next(null);
          } else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (next) => {
      accountDbo.getReferrals(referralId,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting referrals.'
          });
          else {
            referrals = lodash.map(result, 'referralId');
            next(null);
          }
        });
    }, (next) => {
      bonusDbo.getBonuses(deviceId,
        (error, bonuses) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting bonuses.'
          });
          else next(null, bonuses);
        });
    }, (bonuses, next) => {
      let { slcBonusesInfo,
        refBonusesInfo
      } = bonuses;
      next(null, {
        status: 200,
        bonuses: {
          slc: slcBonusesInfo.length ? slcBonusesInfo[0].amount : 0,
          ref: lodash.sum(lodash.map(refBonusesInfo, 'amount'))
        },
        referrals,
        canClaim: referredBy && new Date() > CLAIM_AFTER ? true : false,
        canClaimAfter: referredBy ? CLAIM_AFTER : null
      });
    },
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
  bonusClaim,
  getBonusInfo,
  addBonus
};