let async = require('async');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let sessionDbo = require('../dbos/session.dbo');
let accountHelper = require('../helpers/account.helper');


/**
* @api {post} /account To add account.
* @apiName addAccount
* @apiGroup Account
* @apiParam {String} deviceId device ID of client.
  @apiParam {String} referredBy Referral ID which is valid.
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
        details.referralId = accountHelper.generateReferralId(deviceId);
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
      sessionDbo.initSession({ deviceId },
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
* @apiParam {String} deviceId device ID of client.
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
  let { deviceId } = req.query;
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
* @apiParam {String} deviceId device ID of client.
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
  let { deviceId,
    address } = req.body;
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ deviceId },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking device Id.'
          });
          else if (account) next(null, account);
          else next({
            status: 400,
            message: 'Device is not registered.'
          });
        });
    }, (account, next) => {
      if (account.address) next({
        status: 400,
        message: 'Account address already exists.'
      });
      else next(null);
    }, (next) => {
      accountDbo.getAccount({ address },
        (error, account) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking address.'
          });
          else if (account) next({
            status: 400,
            message: 'Address already associated with another device.'
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

module.exports = {
  addAccount,
  getAccount,
  updateAccount
};