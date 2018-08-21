let AccountModel = require('../models/account.model');


let addAccount = (details, cb) => {
  let account = new AccountModel(details);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAccount = (findObject, cb) => {
  AccountModel.findOne(findObject, {
    '_id': 0
  }, (error, account) => {
    if (error) cb(error, null);
    else cb(null, account);
  });
};

let getAccounts = (cb) => {
  AccountModel.find({}, {
    '_id': 0
  }, (error, accounts) => {
    if (error) cb(error, null);
    else cb(null, accounts || []);
  });
};

let updateAccount = (findObject, updateObject, cb) => {
  AccountModel.findOneAndUpdate(findObject, {
    $set: updateObject
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getReferrals = (referralId, cb) => {
  AccountModel.find({
    referredBy: referralId
  }, {
      '_id': 0
    }, (error, accounts) => {
      if (error) cb(error, null);
      else cb(null, accounts || []);
    });
};

let getSortedAccounts = (object, cb) => {
  let { sortStart, sortCount, sortBy } = object;
  start = parseInt(object.sortStart, 10);
  count = parseInt(object.sortCount, 10);
  AccountModel.find({}, { _id: 0 }, { skip: start, limit: count, sort: sortBy }, (error, leaders) => {
    if (error) cb(error, null);
    else cb(null, leaders);
  });
}
let getAccountsByRefCount = (cb) => {
  AccountModel.aggregate([{ $match: { referredBy: { $ne: null } } },
  { $group: { _id: '$referredBy', refs: { $push: '$referralId' } } },
  { $project: { _id: 1, refs: 1, refsCount: { $size: '$refs' } } }, { $sort: { refsCount: -1 } }],
    (error, leaders) => {
      if (error) { cb(error, null); }
      else cb(null, leaders);
    });
}
module.exports = {
  addAccount,
  getAccount,
  getAccounts,
  getSortedAccounts,
  getAccountsByRefCount,
  getReferrals,
  updateAccount
};