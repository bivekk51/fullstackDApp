const express = require('express');
const { createDistribution, getDistributions, getNgoDistributions } = require('../controllers/distributionController');
const { protect, admin, ngo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, ngo, createDistribution);
router.get('/', protect, getDistributions);
router.get('/ngo', protect, ngo, getNgoDistributions);

module.exports = router;
