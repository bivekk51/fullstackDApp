const Distribution = require('../models/Distribution');

const createDistribution = async (req, res) => {
  const { cid, location, amount, description } = req.body;

  try {
    const distribution = await Distribution.create({
      ngo: req.user._id,
      cid,
      location,
      amount,
      description,
    });

    res.status(201).json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDistributions = async (req, res) => {
  try {
    const distributions = await Distribution.find({}).populate('ngo', 'name email');
    res.json(distributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNgoDistributions = async (req, res) => {
  try {
    const distributions = await Distribution.find({ ngo: req.user._id });
    res.json(distributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDistribution, getDistributions, getNgoDistributions };
