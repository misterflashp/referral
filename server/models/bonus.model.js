let mongoose = require('mongoose');


let bonusSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  slcBonusesInfo: [
    /* {
      amount: number, // required
      txHash: string,
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
  txHash: String
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Bonus', bonusSchema);
