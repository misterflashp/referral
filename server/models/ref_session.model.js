let mongoose = require('mongoose');


let refSessionSchema = new mongoose.Schema({
  device_id: {
    type: String,
    unique: true,
    required: true
  },
  session_id: {
    type: String,
    unique: true,
    required: true
  },
  from_addr: {
    type: String,
    unique: true,
    required: true
  },
  to_addr: {
    type: String,
    unique: true,
    required: true
  },
  sent_bytes: {
    type: Number,
    required: true
  },
  session_duration: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
 
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('ref_session', refSessionSchema);
