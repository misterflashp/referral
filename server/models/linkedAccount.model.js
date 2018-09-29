let mongoose = require('mongoose');


let linkedAccountSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  sncRefId: {
    type: String,
    unique: true,
    required: true
  },
  slcRefId: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: String,
    unique: true,
    required: true
  },
  txHash: {
    type: String
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('LinkedAccount', linkedAccountSchema);