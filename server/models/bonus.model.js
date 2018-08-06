let mongoose = require('mongoose');


let bonusSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  sncBonusesInfo: [
    /* {
      amount: number, // required
      txHash: string,
      sessionNumber: number, // required
      onDate: Date
    } */
  ],
  slcBonusesInfo: [
    /* {
      amount: number, // required
      txHash: string,
      sessionNumber: number // required
      onDate: Date,
    } */
  ],
  refBonusesInfo: [
    /* {
      deviceId: string, // required
      amount: number, // required
      txHash: string,
      onDate: Date,
    } */
  ],
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Bonus', bonusSchema);
