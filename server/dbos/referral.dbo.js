let ReferralModel = require('../models/referral.model');


let addReferral = (details, cb) => {
  let referral = ReferralModel(details);
  referral.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getReferral = (clientAddress, cb) => {
  ReferralModel.findOne({
    clientAddress
  }, {
      '_id': 0
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};


let checkReferralId = (referralId, cb) => {
  ReferralModel.findOne({
    'clientReferralId':referralId
  }, {
      '_id': 0
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let updateReferral = (clientAddress, updateObject, cb) => {
  ReferralModel.findOneAndUpdate({
    clientAddress
  }, {
      $set: updateObject
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let getTotalReferralBonus = (clientReferralId, cb) => {
  ReferralModel.aggregate([{
    $match: {
      'referralId': clientReferralId
    }
  }, {
    $group: {
      '_id': null,
      'amount': {
        $sum: '$referralAmount'
      },
      'count': {
        $sum: 1
      }
    }
  }], (error, result) => {
    if (error) cb(error, null);
    else if (result && result.length) {
      result = result[0];
      delete (result._id);
      cb(null, result);
    } else cb(null, null);
  });
};

module.exports = {
  addReferral,
  getReferral,
  checkReferralId,
  updateReferral,
  getTotalReferralBonus
}