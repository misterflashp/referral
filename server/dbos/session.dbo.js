let RefSessionModel = require('../models/refSession.model');

let getTotalUsage = (cb) => {
  RefSessionModel.aggregate([{
    $group: {
      _id: '$device_id',
      count: { $sum: 1 },
      down: { $sum: '$sent_bytes' }
    }
  }, {
    $sort: {
      down: -1
    }
  }]).exec((error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  });
}
module.exports = {
  getTotalUsage
};