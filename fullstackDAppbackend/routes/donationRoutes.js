const express = require('express');
const { createDonation, getDonations, getUserDonations } = require('../controllers/donationController');
const { protect, admin, donor } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, donor, createDonation);
router.get('/', protect, getDonations);
router.get('/user', protect, getUserDonations);

module.exports = router;
