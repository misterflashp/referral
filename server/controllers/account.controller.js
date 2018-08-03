let async = require('async');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let sessionDbo = require('../dbos/session.dbo');
let accountHelper = require('../helpers/account.helper');


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