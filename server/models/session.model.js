let mongoose = require('mongoose');


let sessionSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  sncSessionsInfo: [
    /* {
      sessionId: number,
      paymentTxHash: string
    } */
  ],
  slcSessionsInfo: [
    /* {
      sessionId: string
    } */
  ]
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Session', sessionSchema);
