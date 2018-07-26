let mongoose = require('mongoose');


let referralSchema = new mongoose.Schema({
  clientAddress: {
    type: String,
    unique: true,
    required: true
  },
  referralId: {
    type: String,
    required: true,
  },
  clientReferralId: {
    type: String,
    required: true
  },
  paymentTxHash: {
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
  clientAmount: {
    type: Number,
    default: 0,
    required: true
  },
  clientTxHash: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        clientTxHash: {
          $type: 'string'
        }
      }
    }
  },
  referralAmount: {
    type: Number,
    default: 0,
    required: true
  },
  referralTxHash: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        referralTxHash: {
          $type: 'string'
        }
      }
    }
  },
  addedOn: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Referral', referralSchema);