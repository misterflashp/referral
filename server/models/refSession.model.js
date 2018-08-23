let mongoose = require('mongoose');


let refSessionSchema = new mongoose.Schema({
  device_id: {
    type: String
  },
  session_id: {
    type: String
  },
  from_addr: {
    type: String
  },
  to_addr: {
    type: String
  },
  sent_bytes: {
    type: Number
    },
  session_duration: {
    type: Number
    },
  amount: {
    type: Number
  },
  timestamp: {
    type: Number
  },
 
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('ref_session', refSessionSchema);
