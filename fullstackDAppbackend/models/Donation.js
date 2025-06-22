const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cid: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  note: {
    type: String
  }
}, {
  timestamps: true
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
