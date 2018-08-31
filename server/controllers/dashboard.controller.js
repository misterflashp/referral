let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../dbos/account.dbo');
let dashBoardDbo = require('../dbos/dashboard.dbo');

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
            accountDbo.getSortedAccounts({
                order, sortBy,
                start: tmpStart,
                count: tmpCount
            }, (error, leaders) => {
                if (error) {
                    next({
                        status: 500,
                        success: false,
                        message: 'Error while fetching data.'
                    }, null);
                } else next(null, leaderboard, leaders);
            });
        }, (leaderboard, leaders, next) => {
            console.log(leaderboard, leaders)
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

let dashSearch = (req, res) => {
    let {
        searchKey,
        feilds } = req.query;
    let search = {};
    feilds = ['deviceId', 'b', 'c'];
    if (feilds.length) {
        lodash.forEach(feilds,
            (feild) => {
                // search[feild] =  { $regex: searchKey, $options: "i" } ;

            });
        lodash.forEach(search,
            (ser) => {
                console.log(ser);
            });

    }
    // console.log(search);
    let arr = [
        { referralId: { $regex: searchKey, $options: "i" } },
        { referredBy: { $regex: searchKey, $options: "i" } },
        { deviceId: { $regex: searchKey, $options: "i" } },
    ];
    async.waterfall([
        (next) => {
            dashBoardDbo.searchByText(searchKey, arr, (error, result) => {
                if (error) next({
                    status: 500,
                    message: 'Error while searching '
                }, null);
                else next(null, {
                    status: 200,
                    info: result
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
}

module.exports = {
    getDashBoard,
    dashSearch
};
