let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let bonusHelper = require('../helpers/bonus.helper');
let { CLAIM_PERIOD } = require('../../config/referral');


let bonusTransfer = (deviceId, bonuses, bonusType, address, cb) => {
  let amount = lodash.sum(lodash.map(bonuses.filter((e) => !e.txHash), 'amount'));
  if (amount === 0) cb(null);
  else {
    async.waterfall([
      (next) => {
        bonusHelper.transferBonus(address, amount,
          (error, txHash) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while transferring amount.'
            });
            else next(null, txHash);
          });
      }, (txHash, next) => {
        bonusDbo.updateBonusInfo(deviceId, bonusType, txHash,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while updating bonus status.'
            });
            else next(null);
          });
      }
    ], (error) => cb(error));
  }
};

let bonusesTransfer = (deviceId, bonusTypes, address, cb) => {
  async.waterfall([
    (next) => {
      bonusDbo.getBonuses(deviceId,
        (error, bonuses) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting bonuses.'
          });
          else next(null, bonuses);
        });
    }, (bonuses, next) => {
      let amount = lodash.sum(lodash.map(bonuses.refBonusesInfo.filter((e) => !e.txHash), 'amount'));
      if (bonusTypes.indexOf('SNC') > -1) amount += lodash.sum(lodash.map(bonuses.sncBonusesInfo.filter((e) => !e.txHash), 'amount'));
      if (bonusTypes.indexOf('SLC') > -1) amount += lodash.sum(lodash.map(bonuses.slcBonusesInfo.filter((e) => !e.txHash), 'amount'));
      if (amount === 0) next({
        status: 400,
        message: 'Bonus already claimed OR no bonuses to claim.'
      });
      else next(null, bonuses);
    }, (bonuses, next) => {
      if (bonusTypes.indexOf('SNC') > -1) {
        let { sncBonusesInfo } = bonuses;
        bonusTransfer(deviceId, sncBonusesInfo, 'SNC', address,
          (error) => {
            if (error) next(error);
            else next(null, bonuses);
          });
      } else next(null, bonuses);
    }, (bonuses, next) => {
      if (bonusTypes.indexOf('SLC') > -1) {
        let { slcBonusesInfo } = bonuses;
        bonusTransfer(deviceId, slcBonusesInfo, 'SLC', address,
          (error) => {
            if (error) next(error);
            else next(null, bonuses);
          });
      } else next(null, bonuses);
    }, (bonuses, next) => {
      if (bonusTypes.indexOf('REF') > -1) {
        let { refBonusesInfo } = bonuses;
        bonusTransfer(deviceId, refBonusesInfo, 'REF', address,
          (error) => {
            if (error) next(error);
            else next(null);
          });
      } else next(null);
    }
  ], (error) => cb(error));
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
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          });
          else if (account) next(null, account);
          else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (account, next) => {
      if (account.address) {
        address = account.address;
        referredBy = account.referredBy;
        next(null);
      } else next({
        status: 400,
        message: 'No account address exists.'
      });
    }, (next) => {
      let bonusTypes = referredBy ? ['REF', 'SNC', 'SLC'] : ['REF'];
      bonusesTransfer(deviceId, bonusTypes, address,
        (error) => {
          if (error) next(error);
          else next(null);
        });
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
            referredBy = account.referredBy;
            next(null);
          } else next({
            status: 400,
            message: 'Device is not registered.'
          });
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
      let sncBonusesInfo = bonuses.sncBonusesInfo.filter((e) => e.txHash);
      let slcBonusesInfo = bonuses.slcBonusesInfo.filter((e) => e.txHash);
      let refBonusesInfo = bonuses.refBonusesInfo.filter((e) => e.txHash);
      let sncSessionDate = null;
      let slcSessionDate = null;
      if (sncBonusesInfo && sncBonusesInfo.length) sncSessionDate = sncBonusesInfo[0].onDate.getTime();
      if (slcBonusesInfo && slcBonusesInfo.length) slcSessionDate = slcBonusesInfo[0].onDate.getTime();
      let sessionDate = Math.min(sncSessionDate || Number.MAX_SAFE_INTEGER, slcSessionDate || Number.MAX_SAFE_INTEGER);
      let amount = lodash.sum(lodash.map(bonuses.refBonusesInfo.filter((e) => !e.txHash), 'amount')) +
        lodash.sum(lodash.map(bonuses.sncBonusesInfo.filter((e) => !e.txHash), 'amount')) +
        lodash.sum(lodash.map(bonuses.slcBonusesInfo.filter((e) => !e.txHash), 'amount'));
      console.log(sncSessionDate, slcSessionDate, sessionDate, amount);
      next(null, {
        status: 200,
        bonuses: {
          snc: lodash.sum(lodash.map(sncBonusesInfo, 'amount')),
          slc: lodash.sum(lodash.map(slcBonusesInfo, 'amount')),
          ref: lodash.sum(lodash.map(refBonusesInfo, 'amount'))
        },
        refCount: refBonusesInfo.length,
        canClaim: (amount && referredBy) ? true : false,
        canClaimAfter: sessionDate ? new Date(sessionDate + CLAIM_PERIOD) : null
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
  getBonusInfo
};