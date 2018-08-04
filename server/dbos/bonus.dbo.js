let BonusModel = require('../models/bonus.model');


let initBonus = (details, cb) => {
  let bonus = new BonusModel(details);
  bonus.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let addBonus = (deviceId, bonusType, bonus, cb) => {
  BonusModel.findOneAndUpdate({
    deviceId
  }, {
      $push: {
        [bonusType === 'SNC' ? 'sncBonusesInfo' :
          bonusType === 'SLC' ? 'slcBonusesInfo' : 'refBonusesInfo']: bonus
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let getBonuses = (deviceId, cb) => {
  BonusModel.findOne({
    deviceId
  }, {
      '_id': 0
    }, (error, bonuses) => {
      if (error) cb(error, null);
      else cb(null, bonuses);
    });
};

let updateBonusInfo = (deviceId, bonusType, txHash, cb) => {
  let key = bonusType === 'SNC' ? 'sncBonusesInfo' : bonusType === 'SLC' ? 'slcBonusesInfo' : 'refBonusesInfo';
  BonusModel.find({
    deviceId
  }, {
      '_id': 0
    }).then((docs) => {
      docs.forEach((doc) => {
        doc[key].forEach((bonus, index) => {
          if (!bonus.txHash) doc[key][index].txHash = txHash;
        });
        doc = doc.toObject();
        BonusModel.findOneAndUpdate({
          deviceId
        }, {
            $set: doc
          }, (error, result) => {
            if (error) cb(error, null);
            else cb(null, result);
          });
      });
    });
};

let updateBonus = (deviceId, updateObject, cb) => {
  BonusModel.findOneAndUpdate({
    deviceId
  }, {
      $push: updateObject
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

module.exports = {
  initBonus,
  addBonus,
  getBonuses,
  updateBonus,
  updateBonusInfo
};
