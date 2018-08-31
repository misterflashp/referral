let mongoose = require('mongoose');


let accountSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  referralId: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        paymentTxHash: {
          $type: 'string'
        }
      }
    }
  },
  referredBy: String,
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Account', accountSchema);
