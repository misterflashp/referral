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
  let { sortBy } = req.query;
  sortBy = (sortBy) ? sortBy : "tokens";
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
      if (sortBy === 'bandwidth') {
        lodash.forEach(usage,
          (use) => {
            index++;
            tmpFinal[use._id] = use._id;
            final.push({
              rank:index,
              referralId:tmpAccounts[use._id],
              totalUsage: use.down
            });
          });
          lodash.forEach(accounts,
          (account)=>{
            if (!tmpFinal[account.deviceId]) {
              index++;
              final.push({
                rank: index,
                referralId: account.referralId,
                totalUsage: 0
              });
            }
          });
          next(null,{
            status:200,
            info:final
          });
      }else if(sortBy==='referral'){
        lodash.forEach(refCounts,
        (ref)=>{
          index++;
          tmpFinal[ref._id]=ref._id;
          final.push({
            rank:index,
            referralId:ref._id,
            noOfReferrals: ref.refsCount
          })
        });
        lodash.forEach(accounts,
          (account)=>{
            if (!tmpFinal[account.referralId]) {
              index++;
              final.push({
                rank: index,
                referralId: account.referralId,
                noOfReferrals: 0
              });
            }
          });
          next(null,{
            status:200,
            info:final
          });
      }else {
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
          });
        next(null, {
          status: 200,
          info: final2
        });
      } 
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
