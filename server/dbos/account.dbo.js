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

let updateAccount = (findObject, updateObject, cb) => {
  AccountModel.findOneAndUpdate(findObject, {
    $set: updateObject
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

module.exports = {
  addAccount,
  getAccount,
  updateAccount
};