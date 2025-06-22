const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cid: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Distribution = mongoose.model('Distribution', distributionSchema);

module.exports = Distribution;
