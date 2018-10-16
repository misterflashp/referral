let RefSessionModel = require('../models/refSession.model');
let { LINK_END_SECONDS,
  AIRDROP_END_SECONDS, MB_100 } = require('../../config/referral');


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
let getRefSessions = (device_ids, cb) => {
  RefSessionModel.aggregate([{
    '$match': {
      'device_id': {
        '$in': device_ids
      },
      'timestamp': {
        '$lt': LINK_END_SECONDS
      }
    }
  }, {
    '$group': {
      '_id': '$device_id',
      'ba_sessions': {
        '$sum': {
          '$cond': [{
            '$and': [{ '$lt': ['$timestamp', AIRDROP_END_SECONDS] },
            { '$gte': ['$sent_bytes', MB_100] }]
          }, 1, 0]
        }
      },
      'aa_sessions': {
        '$sum': {
          '$cond': [{
            '$and': [{ '$gte': ['$timestamp', AIRDROP_END_SECONDS] },
            { '$gte': ['$sent_bytes', MB_100] }]
          }, 1, 0]
        }
      },
      'usage': {
        '$sum': '$sent_bytes'
      }
    }
  }, {
    '$match': {
      'ba_sessions': { '$gte': 1 },
      'aa_sessions': { '$gte': 1 }
    }
  }]).exec((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
}

let getTotalUsageOf = (deviceId, cb) => {
  RefSessionModel.aggregate([{
    $match: {
      'device_id': deviceId
    }
  }, {
    $group: {
      _id: '$device_id',
      count: { $sum: 1 },
      down: { $sum: '$sent_bytes' }
    }
  }]).exec((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
}

module.exports = {
  getTotalUsage,
  getTotalUsageOf,
  getRefSessions
};