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
        [bonusType === 'SLC' ? 'slcBonusesInfo' : 'refBonusesInfo']: bonus
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
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let updateBonusInfo = (deviceId, txHash, cb) => {
  BonusModel.find({
    deviceId
  }, {
      '_id': 0
    }).then((docs) => {
      docs.forEach((doc) => {
        doc['refBonusesInfo'].forEach((bonus, index) => {
          if (!bonus.txHash) doc['refBonusesInfo'][index].txHash = txHash;
        });
        if (doc['slcBonusesInfo'].length && !doc['slcBonusesInfo'][0].txHash)
          doc['slcBonusesInfo'][0].txHash = txHash;
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

let getTotalBonus = (cb) => {
  BonusModel.aggregate([
    {
      $project: {
        _id: '$deviceId',
        count: {
          $size: '$refBonusesInfo'
        },
        refBonusesInfo: 1,
        slcBonusesInfo: 1
      }
    }, {
      $group: {
        _id: '$_id',
        totalRefBonus: { $sum: { $sum: '$refBonusesInfo.amount' } },
        totalSlcBonus: { $sum: { $sum: '$slcBonusesInfo.amount' } },
        count: { $sum: '$count' },
      }
    }, {
      $project: {
        total: { $sum: ['$totalRefBonus', '$totalSlcBonus'] },
        count: 1
      }
    }, {
      $sort: {
        total: -1
      }
    }]).exec((error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

module.exports = {
  initBonus,
  addBonus,
  getTotalBonus,
  getBonuses,
  updateBonusInfo
};