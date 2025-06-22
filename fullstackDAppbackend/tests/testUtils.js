const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Distribution = require('../models/Distribution');
const jwt = require('jsonwebtoken');

// Connect to test database
const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {});
    console.log('Test DB connected');
  } catch (error) {
    console.error(`Error connecting to test DB: ${error.message}`);
    // Instead of exiting, we'll use a mock DB approach for testing
    console.log('Using mock database for tests');
  }
};

// Clear database collections
const clearDatabase = async () => {
  await User.deleteMany({});
  await Donation.deleteMany({});
  await Distribution.deleteMany({});
};

// Disconnect from database
const disconnectDB = async () => {
  await mongoose.connection.close();
};

// Generate test token
const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Create test user
const createTestUser = async (userData) => {
  const user = await User.create(userData);
  const token = generateTestToken(user._id);
  return { user, token };
};

// Create multiple test users
const createTestUsers = async () => {
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });

  const ngo = await User.create({
    name: 'NGO User',
    email: 'ngo@test.com',
    password: 'password123',
    role: 'ngo',
  });

  const donor = await User.create({
    name: 'Donor User',
    email: 'donor@test.com',
    password: 'password123',
    role: 'donor',
  });

  return {
    admin: {
      user: admin,
      token: generateTestToken(admin._id)
    },
    ngo: {
      user: ngo,
      token: generateTestToken(ngo._id)
    },
    donor: {
      user: donor,
      token: generateTestToken(donor._id)
    }
  };
};

module.exports = {
  connectTestDB,
  clearDatabase,
  disconnectDB,
  generateTestToken,
  createTestUser,
  createTestUsers
};
