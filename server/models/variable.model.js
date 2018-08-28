let mongoose = require('mongoose');

let variableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  appCode: {
    type: String,
    required: true
  },
  varType: {
    type: String,
    required: true
  },
  updatedOn: {
    type: Date,
    required: true
  }
}, {
    versionKey: false,
    strict: true
  });
module.exports = mongoose.model('variables', variableSchema);