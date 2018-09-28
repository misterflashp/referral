let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let accountHelper = require('../helpers/account.helper');
let sessionDbo = require('../dbos/session.dbo');
let bonusHelper = require('../helpers/bonus.helper');
let { CLAIM_AFTER,
  REF_BONUS,
  SLC_BONUS,
  FIVE_GB,
  USAGE_BONUS } = require('../../config/referral');


/**
* @api {POST} /accounts To add account.
* @apiName addAccount
* @apiGroup Accounts
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
* @api {GET} /accounts/:type/:value To get account information.
* @apiName getAccount
* @apiGroup Accounts
* @apiParam {String} type [deviceId || address]
* @apiParam {String} value deviceId or address based on type.
* @apiError DeviceNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
* }
* @apiError InvalidType Provided type is invalid.
* @apiErrorExample InvalidType-Response:
* {
*   success: false,
*   message: 'Invalid type.'
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
  let {
    type,
    value
  } = req.params;
  let findObj = null;
  async.waterfall([
    (next) => {
      if (type === 'deviceId') {
        findObj = { deviceId: value };
        next(null);
      } else if (type === 'address') {
        findObj = { address: value };
      } else next({
        status: 400,
        message: 'Invalid type.'
      });
    }, (next) => {
      accountDbo.getAccount(findObj,
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
* @api {PUT} /accounts/:deviceId To update account address.
* @apiName updateAccount
* @apiGroup Accounts
* @apiParam {String} deviceId Device ID of client.
* @apiParam {String} address Account address of client.
* @apiError DeviceIdNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceIdNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
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
* @apiGroup Accounts
* @apiError ErrorWhileFetchingAccounts Error while fetching accounts.
* @apiSuccessExample Response: 
* {
*   success: true,
*   accounts: [{
*     deviceId: String,
*     referralId: String,
*     addedOn: Date,
*     refs: []
*   }]
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
* @api {POST} /accounts/:deviceId/bonuses/claim To claim bonus.
* @apiName bonusClaim
* @apiGroup Bonus
* @apiParam {String} deviceId Device ID of linked account.
* @apiError DeviceNotRegistered Provided device ID not registered.
* @apiErrorExample DeviceNotRegistered-Response:
* {
*   success: false,
*   message: 'Device is not registered.'
* }
* @apiError CantClaimBonus Not satisfying the bonus claim conditions
* @apiErrorExample CantClaimBonus-Response:
* {
*   success: false,
*   message: 'You can\'t claim bonus.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Bonus claimed successfully.'
* }
*/
let bonusClaim = (req, res) => {
  let { deviceId } = req.params;
  let accountAddress = null;
  let referredBy = null;
  let usage = null;
  let txHash = null;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          });
          else if (account) {
            accountAddress = account.address;
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
      bonusDbo.getBonuses(deviceId,
        (error, bonuses) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting bonuses.'
          });
          else {
            txHash = bonuses.txHash;
            next(null, bonuses);
          }
        });
    }, (next) => {
      if (txHash || !referredBy || !accountAddress || new Date() < CLAIM_AFTER) {
        next({
          status: 400,
          message: 'You can\'t claim bonus.'
        });
      } else next(null);
    }, (bonuses, next) => {
      let { refBonusesInfo,
        slcBonusesInfo } = bonuses;
      let amount = lodash.sum(lodash.map(refBonusesInfo, 'amount'));
      if (slcBonusesInfo.length) amount += slcBonusesInfo[0].amount;
      if (usage >= FIVE_GB) amount += USAGE_BONUS
      next(null, amount);
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
* @api {GET} /accounts/:deviceId/bonuses To get bonus information.
* @apiName getBonuses
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
*     slc: Number,
*     ref: Number,
*     other: Number
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
  let accountAddress = null;
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
            accountAddress = account.address;
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
          other: usage >= FIVE_GB ? USAGE_BONUS : 0
        },
        refCount: referrals.length,
        canClaim: !txHash && referredBy && accountAddress && new Date() > CLAIM_AFTER ? true : false,
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

/**
* @api {POST} /accounts/link/:sncRefId/:slcRefId To link the accounts.
* @apiName linkAccounts
* @apiGroup Accounts
* @apiParam {String} sncRefId SNC referral ID.
* @apiParam {String} slcRefId SLC referral ID.
* @apiParam {String} address Etherem account address that is connected with sncRefId.
* @apiParam {String} deviceId Device ID that is connected with slcRefId.
* @apiError InvalidRefAddressCombination Provided sncrefId and address are invalid
* @apiErrorExample InvalidRefAddressCombination-Response:
* {
*   success: false,
*   message: 'Invalid address and ref code combination.'
* }
* @apiError InvalidRefDeviceIdCombination Provided slcrefId and deviceId are invalid
* @apiErrorExample InvalidRefDeviceIdCombination-Response:
* {
*   success: false,
*   message: 'Invalid deviceId and ref code combination.'
* }
* @apiError DuplicateEntry Provided fields are duplicate
* @apiErrorExample DuplicateEntry-Response:
* {
*   success: false,
*   message: 'Duplicate values.'
* }
* @apiSuccessExample Response: 
* {
*   success: true,
*   message: 'Accounts linked successfully.'
* }
*/
let linkAccounts = (req, res) => {
  let {
    sncRefId,
    slcRefId
  } = req.params;
  let {
    deviceId,
    address
  } = req.body;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ referralId: sncRefId, address },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          }); else if (account) next(null);
          else next({
            status: 400,
            message: 'Invalid address and ref code combination.'
          })
        });
    }, (next) => {
      accountDbo.getAccount({ referralId: slcRefId, deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching account.'
          }); else if (account) next(null);
          else next({
            status: 400,
            message: 'Invalid deviceId and ref code combination.'
          })
        });
    }, (next) => {
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
  addAccount,
  getAccount,
  getAccounts,
  updateAccount,
  bonusClaim,
  getBonuses,
  addBonus,
  linkAccounts
};