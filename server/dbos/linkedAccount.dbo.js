let LinkedAccountModel = require('../models/linkedAccount.model');


let addAccount = (details, cb) => {
  let account = new LinkedAccountModel(details);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAccount = (findObject, cb) => {
  LinkedAccountModel.findOne(findObject, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let updateAccount = (findObject, updateObject, cb) => {
  LinkedAccountModel.findOneAndUpdate(findObject, {
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