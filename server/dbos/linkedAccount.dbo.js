let LinkedAccountModel = require('../models/linkedAccount.model');
let { LINK_END_DATE,
  AIRDROP_END_DATE } = require('../../config/referral');


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
let getLinkedAccounts = (cb) => {
  LinkedAccountModel.aggregate([{
    '$match': {
      '$and': [
        {'addedOn': {'$gte': AIRDROP_END_DATE}},
        {'addedOn': {'$lt': LINK_END_DATE}}
      ]
    }
  }, {
    '$lookup': {
      'from': 'accounts',
      'localField': 'deviceId',
      'foreignField': 'deviceId',
      'as': 'account'
    }
  }, {
    '$match': {
      'account.0.addedOn': {
        '$lt': AIRDROP_END_DATE
      }
    }
  }]).exec((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
}

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
  updateAccount,
  getLinkedAccounts
};