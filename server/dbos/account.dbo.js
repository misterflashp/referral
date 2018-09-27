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
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAccounts = (findObj, cb) => {
  AccountModel.find(findObj, {
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
  let { start,
    count,
    order,
    sortBy } = object;
  let sortObj = {}; sortObj[sortBy] = order;
  AccountModel.find({}, { _id:0 }, {
    sort: sortObj,
    skip: start,
    limit: count
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  });
};

let getSortedAccountsByRefCount = (order, cb) => {
  AccountModel.aggregate([{
    $match: {
      referredBy: { $ne: null }
    }
  }, {
    $group: {
      _id: '$referredBy',
      refs: { $push: '$referralId' }
    }
  }, {
    $project: {
      _id: 1,
      refs: 1,
      refsCount: { $size: '$refs' }
    }
  }, {
    $sort: { refsCount: order }
  }], (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

module.exports = {
  addAccount,
  getAccount,
  getAccounts,
  getSortedAccounts,
  getSortedAccountsByRefCount,
  getReferrals,
  updateAccount
};