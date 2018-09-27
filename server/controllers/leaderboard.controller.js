let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let bonusDbo = require('../dbos/bonus.dbo');
let sessionDbo = require('../dbos/session.dbo');


/**
* @api {get} /leaderboard To fetch leaderboard.
* @apiName getLeaderBoard
* @apiGroup Leaderboard
* @apiParam {String} sortBy Attribute to sort, Available attributes [bandwidth, tokens, referral], default sortBy is 'tokens'.
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
  let { sortBy,
    start,
    count,
    order } = req.query;
  if (sortBy === 'bandwidth') sortBy = 'totalUsage';
  else if (sortBy === 'referral') sortBy = 'noOfReferrals'
  if (!sortBy) sortBy = 'tokens';
  if (!start) start = 0;
  if (!count) count = 1000000;
  if (!order) order = 'desc';
  start = parseInt(start, 10);
  count = parseInt(count, 10);
  let end = start + count;
  async.waterfall([
    (next) => {
      accountDbo.getAccounts({},
        (error, accounts) => {
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
            [sortBy !== 'tokens' ? 'rank' : 'index']: index,
            deviceId: bonus._id,
            tokens: bonus.total,
            referralId: tmpAccounts[bonus._id],
            noOfReferrals: bonus.count // (tmpRef[tmpAccounts[bonus._id]]) ? tmpRef[tmpAccounts[bonus._id]] : 0
          });
        });
      lodash.forEach(accounts,
        (account) => {
          if (!tmpFinal[account.deviceId]) {
            index++;
            final.push({
              [sortBy != 'tokens' ? 'rank' : 'index']: index,
              deviceId: account.deviceId,
              tokens: 0,
              referralId: account.referralId,
              noOfReferrals: tmpBonus[account.deviceId].count //(tmpRef[account.referralId]) ? tmpRef[account.referralId] : 0
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
            if (obj.totalUsage > 5 * 1024 * 1024 * 1024) obj['tokens'] += 1000 * Math.pow(10, 8);
            final2.push(obj);
          } else {
            let obj = Object.assign(fin, {
              noOfSessions: 0,
              totalUsage: 0
            });
            final2.push(obj);
          }
        });
      next(null, final2);
    },
    (final2, next) => {
      final2 = lodash.orderBy(final2, [sortBy], [order])
      let index = 1;
      lodash.forEach(final2, (doc) => { doc.index = index++; });
      final2 = final2.slice(start, end);
      next(null, {
        status: 200,
        info: final2,
        count: index
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

module.exports = {
  getLeaderBoard
};