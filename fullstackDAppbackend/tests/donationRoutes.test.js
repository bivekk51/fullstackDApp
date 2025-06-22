const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Donation = require('../models/Donation');
const { connectTestDB, clearDatabase, disconnectDB, createTestUsers } = require('./testUtils');

// Load test environment variables
require('./setup');

describe('Donation API Routes', () => {
  let users;

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    users = await createTestUsers();
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDB();
  });

  describe('POST /api/donations', () => {
    test('should create a new donation for a donor', async () => {
      const donationData = {
        cid: 'Qm123456789',
        amount: 100,
        note: 'Test donation'
      };

      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${users.donor.token}`)
        .send(donationData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.cid).toBe(donationData.cid);
      expect(response.body.amount).toBe(donationData.amount);
      expect(response.body.note).toBe(donationData.note);
    });

    test('should not allow NGO to create a donation', async () => {
      const donationData = {
        cid: 'Qm123456789',
        amount: 100,
        note: 'Test donation'
      };

      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${users.ngo.token}`)
        .send(donationData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/donations', () => {
    test('should get all donations', async () => {
      // Create a test donation
      await Donation.create({
        user: users.donor.user._id,
        cid: 'Qm123456789',
        amount: 100,
        note: 'Test donation'
      });

      const response = await request(app)
        .get('/api/donations')
        .set('Authorization', `Bearer ${users.donor.token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].cid).toBe('Qm123456789');
    });
  });

  describe('GET /api/donations/user', () => {
    test('should get donations for the current user', async () => {
      // Create two donations (one for the donor and one for another user)
      await Donation.create({
        user: users.donor.user._id,
        cid: 'Qm123456789',
        amount: 100,
        note: 'Donation from donor'
      });

      await Donation.create({
        user: users.admin.user._id,
        cid: 'Qm987654321',
        amount: 200,
        note: 'Donation from admin'
      });

      const response = await request(app)
        .get('/api/donations/user')
        .set('Authorization', `Bearer ${users.donor.token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].note).toBe('Donation from donor');
    });
  });
});
