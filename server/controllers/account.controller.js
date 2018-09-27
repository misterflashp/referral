let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let accountHelper = require('../helpers/account.helper');
let sessionDbo = require('../dbos/session.dbo');
let bonusHelper = require('../helpers/bonus.helper');
let { CLAIM_AFTER,
  REF_BONUS,
  SLC_BONUS } = require('../../config/referral');


/**
* @api {post} /account To add account.
* @apiName addAccount
* @apiGroup Account
* @apiParam {String} deviceId Device ID of client.
* @apiParam {String} address Account address of client.
* @apiParam {String} referredBy Referral ID which is valid.
* @apiError DeviceIdAlreadyExists Provided deviceId already exists 
* @apiErrorExample DeviceIdAlreadyExists-Response:
* {
*   success: false,
*   message: 'Device is already registered.'
* }
* @apiError ReferredByNotExists Provided referral ID not exists 
* @apiErrorExample ReferredByNotExists-Response:
* {
*   success: false,
*   message: 'No account exists with referredBy.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Account added successfully.'
* }
*/
let addAccount = (req, res) => {
  let details = req.body;
  let { deviceId,
    referredBy } = details;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking device Id.'
          });
          else if (account) next({
            status: 400,
            message: 'Device is already registered.'
          });
          else next(null);
        });
    }, (next) => {
      if (referredBy) {
        accountDbo.getAccount({
          referralId: referredBy
        }, (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking referredBy.'
          });
          else if (account) next(null);
          else next({
            status: 400,
            message: 'No account exists with referredBy.'
          });
        });
      } else next(null);
    }, (next) => {
      try {
        details.referralId = accountHelper.generateReferralId();
        next(null);
      } catch (error) {
        next({
          status: 500,
          message: 'Error occurred while creating referral Id.'
        });
      }
    }, (next) => {
      bonusDbo.initBonus({ deviceId },
        () => {
          next(null);
        });
    }, (next) => {
      accountDbo.addAccount(details,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding account.'
          });
          else next(null, {
            status: 200,
            message: 'Account added successfully.'
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
* @api {get} /account To get account information.
* @apiName getAccount
* @apiGroup Account
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
*   account: {
*     deviceId: String,
*     referralId: String,
*     address: String,
*     referredBy: String,
*     addedOn: Date
*   }
* }
*/
let getAccount = (req, res) => {
  let { deviceId } = req.params;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking device Id.'
          });
          else if (account) next(null, {
            status: 200,
            account
          });
          else next({
            status: 400,
            message: 'Device is not registered.'
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
* @api {put} /account To update account address.
* @apiName updateAccount
* @apiGroup Account
* @apiParam {String} deviceId Device ID of client.
* @apiParam {String} address Account address of client.
* @apiError DeviceIdNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceIdNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
* }
* @apiError AccountAddressAlreadyExists Provided device ID already linked with an address.
* @apiErrorExample AccountAddressAlreadyExists-Response:
* {
*   success: false,
*   message: 'Account address already exists.'
* }
* @apiError AddressAlreadyAssociatedWithOtherDevice Provided address already associated with another device.
* @apiErrorExample AddressAlreadyAssociatedWithOtherDevice-Response:
* {
*   success: false,
*   message: 'Address already associated with another device.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Account updated successfully.'
* }
*/
let updateAccount = (req, res) => {
  let { deviceId } = req.params;
  let { address } = req.body;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking device Id.'
          });
          else if (account) next(null);
          else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (next) => {
      accountDbo.getAccount({ address },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking address.'
          });
          else if (account) next({
            status: 400,
            message: 'Address already associated with a device.'
          });
          else next(null);
        });
    }, (next) => {
      accountDbo.updateAccount({ deviceId }, { address },
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while updating account.'
          });
          else next(null, {
            status: 200,
            message: 'Account updated successfully.'
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
* @api {get} /accounts To get list of all accounts.
* @apiName getAccount
* @apiGroup Account
* @apiError ErrorWhileFetchingAccounts Error while fetching accounts.
* @apiErrorExample ErrorWhileFetchingAccounts-Response:
* {
*   success: false,
*   message: 'Error occoured while fetching accounts.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   account: {
*     deviceId: String,
*     referralId: String,
*     addedOn: Date,
*     refs: []
*   }
* }
*/
let getAccounts = (req, res) => {
  async.waterfall([
    (next) => {
      accountDbo.getAccounts({},
        (error, accounts) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching accounts.'
          });
          else next(null, accounts);
        });
    }, (_accounts, next) => {
      let refs = {};
      let accounts = [];
      lodash.forEach(_accounts,
        (account) => {
          let { referralId } = account;
          if (!refs.hasOwnProperty(referralId)) refs[referralId] = [];
        });
      lodash.forEach(_accounts,
        (account) => {
          let { referralId, referredBy } = account;
          if (referredBy) refs[referredBy].push(referralId);
        });
      lodash.forEach(_accounts,
        (account) => {
          let { referralId } = account;
          account.refs = refs[referralId];
          account = account.toObject();
          accounts.push(Object.assign({}, account, {
            refs: refs[referralId]
          }));
        });
      next(null, {
        status: 200,
        accounts
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
  let { deviceId } = req.params;
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
let getBonuses = (req, res) => {
  let { deviceId } = req.params;
  let referrals = [];
  let txHash = null;
  let referralId = null;
  let referredBy = null;
  let usage = null;
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
      sessionDbo.getTotalUsageOf(deviceId,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting usage.'
          });
          else {
            usage = result.length ? result[0].down : 0;
            next(null);
          }
        })
    }, (next) => {
      accountDbo.getAccounts({ referredBy: referralId },
        (error, accounts) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting referrals.'
          });
          else {
            referrals = lodash.map(accounts, 'referralId');
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
          ref: lodash.sum(lodash.map(refBonusesInfo, 'amount')),
          other: usage > FIVE_GB ? USAGE_BONUS : 0
        },
        refCount: referrals.length,
        canClaim: !txHash && referredBy && new Date() > CLAIM_AFTER ? true : false,
        canClaimAfter: !txHash && referredBy ? CLAIM_AFTER : null
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
  addAccount,
  getAccount,
  getAccounts,
  updateAccount,
  bonusClaim,
  getBonuses,
  addBonus
};