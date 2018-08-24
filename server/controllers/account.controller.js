let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let sessionDbo = require('../dbos/session.dbo');
let accountHelper = require('../helpers/account.helper');
let leaderVariables = require('../../config/leaderboard');

let leaderVariable = (req, res) =>{
  response= leaderVariables.leaderboard;
  res.status(200).send(response);
}

let dashVariable = (req, res) =>{
  response= leaderVariables.dashboard;
  res.status(200).send(response);
}
/**
* @api {post} /account To add account.
* @apiName addAccount
* @apiGroup Account
* @apiParam {String} deviceId Device ID of client.
* @apiParam {String} address Account address of client.
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


/**
* @api {get} /dashboard To fetch dashboard.
* @apiName getDashBoard
* @apiGroup Dashboard
* @apiParam {String} sortBy Attribute to sort, Available attributes [deviceId, referredBy, referralId, addedOn, refCount], default sortBy is 'refCount'.
* @apiParam {Number} start Number of records to skip, default value is 0 and use positive numbers.
* @apiParam {Number} count Number of records to return, default value is 10, use positive numbers.
* @apiParam {String} order Order to sort [asc/desc], Default sort [desc].
* @apiError ErrorWhileFetchingData Error while fetching dashboard.
* @apiErrorExample ErrorWhileFetchingData-Response:
* {
*   success: false,
*   message: 'Error while fetching data.'
* }
* @apiSuccessExample Response: 
* 
* {
*  "success": true,
*  "info": [
*    {
*      "deviceId": "0000000000000000",
*      "referredBy": "SENT-XXXXXXXX",
*      "referralId": "SENT-XXXXXXXX",
*      "addedOn":    "2018-08-08T07:30:04.969Z",
*      "refs": [
*         "SENT-XXXXXXXY",
*         "SENT-XXXXXXXZ",
*         "SENT-XXXXXXXW",
*         "SENT-XXXXXXXL"
*        ]
*    }
*   ]
* }
   
*/
let getDashBoard = (req, res) => {
  let { sortBy,
    start,
    count,
    order } = req.query;
  if (!sortBy) sortBy = 'refCount';
  if (!start) start = 0;
  if (!count) count = 10;
  if (!order) order = 'desc';
  order = (order === 'desc') ? -1 : 1;
  order = parseInt(order, 10);
  start = parseInt(start, 10);
  count = parseInt(count, 10);
  let end = start + count;

  async.waterfall([
    (next) => {
      accountDbo.getSortedAccountsByRefCount(order, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error while fetching data.'
        }, null);
        else next(null, result);
      });
    }, (leaderboard, next) => {
      let tmpStart = sortBy === 'refCount' ? 0 : start;
      let tmpCount = sortBy === 'refCount' ? 1000000 : count;
      accountDbo.getSortedAccounts({ order, sortBy, tmpStart, tmpCount },
        (error, leaders) => {
          if (error) {
            next({
              status: 500,
              success: false,
              message: 'Error while fetching data.'
            }, null);
          } else next(null, leaderboard, leaders);
        });
    }, (leaderboard, leaders, next) => {
      if (sortBy === 'refCount') {
        let temp = {};
        let final = [];
        let temp2 = {};
        lodash.forEach(leaders,
          (leader) => {
            temp[leader.referralId] = leader;
          });
        lodash.forEach(leaderboard,
          (lead) => {
            temp2[lead._id] = lead;
          });
        if (order === -1) {
          lodash.forEach(leaderboard,
            (lead) => {
              final.push(Object.assign(
                temp[lead._id].toObject(), {
                  refs: lead.refs
                }));
            });
        }
        lodash.forEach(leaders,
          (leader) => {
            if (!temp2[leader.referralId]) {
              final.push(Object.assign(
                temp[leader.referralId].toObject(), {
                  refs: []
                }));
            }
          });
        if (order === 1) {
          lodash.forEach(leaderboard,
            (lead) => {
              final.push(Object.assign(
                temp[lead._id].toObject(), {
                  refs: lead.refs
                }));
            });
        }
        final1 = final.slice(start, end);
        next(null, {
          status: 200,
          info: final1
        });
      } else {
        let temp = {};
        lodash.forEach(leaderboard,
          (leader) => {
            temp[leader._id] = leader;
          });
        let final = [];
        lodash.forEach(leaders,
          (lead) => {
            final.push({
              deviceId: lead.deviceId,
              referredBy: lead.referredBy,
              referralId: lead.referralId,
              addedOn: lead.addedOn,
              refs: temp[lead.referralId] ? temp[lead.referralId].refs : []
            });
          });
        next(null, {
          status: 200,
          info: final
        });
      }
    }], (error, success) => {
      let response = Object.assign({
        success: !error
      }, error || success);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
};


/**
* @api {get} /leaderboard To fetch leaderboard.
* @apiName getLeaderBoard
* @apiGroup Leaderboard
* @apiError ErrorWhileFetchingData Error while fetching leaderboard.
* @apiErrorExample ErrorWhileFetchingData-Response:
* {
*   success: false,
*   message: 'Error while fetching [accounts/bonuses/sessionUsage/refCount].'
* }
* @apiSuccessExample Response: 
* 
* {
*  "success": true,
*  "info": [
*    {
*      "index":   00000000
*      "deviceId": 0000000000000000,
*      "tokens":   0000000000000000,
*      "referralId": "SENT-XXXXXXXX"
*      "noOfReferrals": 00000000,
*      "noOfSessions":  00000000,
*      "totalUsage": XXXXXXXX (In bytes)
*    }
*   ]
* }
   
*/
let getLeaderBoard = (req, res) => {
  async.waterfall([
    (next) => {
      accountDbo.getAccounts((error, accounts) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching accounts'
          }, null);
        } else next(null, accounts);
      });
    }, (accounts, next) => {
      let order = -1;
      accountDbo.getSortedAccountsByRefCount(order,
        (error, refCounts) => {
          if (error) {
            next({
              status: 500,
              message: 'Error while fetching refCounts'
            }, null);
          } else next(null, accounts, refCounts);
        });
    },
    (accounts, refCounts, next) => {
      bonusDbo.getTotalBonus((error, bonuses) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching bonuses'
          }, null);
        } else next(null, accounts, refCounts, bonuses);
      })
    }, (accounts, refCounts, bonuses, next) => {
      sessionDbo.getTotalUsage((error, usage) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching usage'
          }, null);
        } else next(null, accounts, refCounts, bonuses, usage);
      })
    }, (accounts, refCounts, bonuses, usage, next) => {
      let tmpAccounts = {};
      let tmpBonus = {};
      let tmpRef = {};
      let tmpUsage = {};
      let final = [];
      let tmpFinal = {};
      let final2 = [];
      let index = 0;
      lodash.forEach(accounts,
        (account) => {
          tmpAccounts[account.deviceId] = account.referralId;
        });
      lodash.forEach(usage,
        (use) => {
          tmpUsage[use._id] = use;
        });
      lodash.forEach(bonuses,
        (bonus) => {
          tmpBonus[bonus._id] = bonus;
        });
      lodash.forEach(refCounts,
        (ref) => {
          tmpRef[ref._id] = ref.refsCount;
        });
      lodash.forEach(bonuses,
        (bonus) => {
          tmpFinal[bonus._id] = bonus._id;
          index++;
          final.push({
            index: index,
            deviceId: bonus._id,
            tokens: bonus.total,
            referralId: tmpAccounts[bonus._id],
            noOfReferrals: (tmpRef[tmpAccounts[bonus._id]]) ? tmpRef[tmpAccounts[bonus._id]] : 0
          });
        });
      lodash.forEach(accounts,
        (account) => {
          if (!tmpFinal[account.deviceId]) {
            index++;
            final.push({
              index: index,
              deviceId: account.deviceId,
              tokens: 0,
              referralId: account.referralId,
              noOfReferrals: (tmpRef[account.referralId]) ? tmpRef[account.referralId] : 0
            });
          }
        });
      lodash.forEach(final,
        (fin) => {
          if (tmpUsage[fin.deviceId]) {
            let obj = Object.assign(fin, {
              noOfSessions: tmpUsage[fin.deviceId].count,
              totalUsage: tmpUsage[fin.deviceId].down
            });
            final2.push(obj);
          } else {
            let obj = Object.assign(fin, {
              noOfSessions: 0,
              totalUsage: 0
            });
            final2.push(obj);
          }
        })
      next(null, {
        status: 200,
        info: final2
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
}
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
      accountDbo.getAccounts((error, accounts) => {
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

module.exports = {
  addAccount,
  getDashBoard,
  getLeaderBoard,
  leaderVariable,
  dashVariable,
  getAccount,
  getAccounts,
  updateAccount
};
