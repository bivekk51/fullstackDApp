const Donation = require('../models/Donation');

const createDonation = async (req, res) => {
  const { cid, amount, note } = req.body;

  try {
    const donation = await Donation.create({
      user: req.user._id,
      cid,
      amount,
      note,
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).populate('user', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDonation, getDonations, getUserDonations };
