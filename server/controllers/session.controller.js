let async = require('async');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let sessionDbo = require('../dbos/session.dbo');
let { SNC_BONUSES,
  SLC_BONUSES,
  REF_BONUS } = require('../../config/referral');


let VALID_SESSIONS = [1, 50];

let addReferredByBonus = (referralId, deviceId, cb) => {
  async.waterfall([
    (next) => {
      accountDbo.getAccount({ referralId },
        (error, account) => {
          if (error) next({
            code: 204,
            message: 'Error occurred while fetching referredBy account.'
          });
          else next(null, account.deviceId);
        });
    }, (_deviceId, next) => {
      bonusDbo.addBonus(_deviceId, 'REF', {
        deviceId,
        amount: REF_BONUS,
        txHash: null,
        onDate: new Date()
      }, (error, result) => {
        if (error) next({
          code: 205,
          message: 'Error occurred while adding referredBy bonus.'
        });
        else next(null);
      });
    }
  ], (error) => cb(error));
};

let addBonuses = (deviceId, referredBy, bonusType, sessionNumber, cb) => {
  async.waterfall([
    (next) => {
      bonusDbo.addBonus(deviceId, bonusType, {
        amount: bonusType === 'SNC' ? SNC_BONUSES[sessionNumber] : SLC_BONUSES[sessionNumber],
        txHash: null,
        sessionNumber,
        onDate: new Date()
      }, (error, result) => {
        if (error) next({
          code: 101,
          message: 'Error occurred while adding bonus.'
        });
        else next(null);
      });
    }, (next) => {
      if (referredBy && sessionNumber === 1) {
        addReferredByBonus(referredBy, deviceId,
          (error) => {
            if (error) next(error);
            else next(null);
          });
      } else next(null);
    }
  ], (error) => cb(error));
};

let addSession = (req, res) => {
  let { deviceId,
    session } = req.body;
  let referredBy = null;
  let appCode = session.hasOwnProperty('paymentTxHash') ? 'SNC' : 'SLC';
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
      sessionDbo.addSession(deviceId, appCode, session,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding session.'
          });
          else {
            let sessionsCount = appCode === 'SNC' ?
              result.sncSessionsInfo.length : result.slcSessionsInfo.length;
            sessionsCount += 1;
            next(null, sessionsCount);
          }
        });
    }, (sessionsCount, next) => {
      if (VALID_SESSIONS.indexOf(sessionsCount) > -1) {
        addBonuses(deviceId, referredBy, appCode, sessionsCount,
          (error) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while adding bonus.'
            })
            else next(null, {
              status: 200,
              message: 'Session and bonus added successfully.'
            });
          });
      } else next(null, {
        status: 200,
        message: 'Session added successfully.'
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
  addSession
};