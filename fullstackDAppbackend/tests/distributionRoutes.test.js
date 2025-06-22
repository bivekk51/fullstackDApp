const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Distribution = require('../models/Distribution');
const { connectTestDB, clearDatabase, disconnectDB, createTestUsers } = require('./testUtils');

// Load test environment variables
require('./setup');

describe('Distribution API Routes', () => {
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

  describe('POST /api/distributions', () => {
    test('should create a new distribution for an NGO', async () => {
      const distributionData = {
        cid: 'Qm123456789',
        location: 'Test Location',
        amount: 50,
        description: 'Test distribution'
      };

      const response = await request(app)
        .post('/api/distributions')
        .set('Authorization', `Bearer ${users.ngo.token}`)
        .send(distributionData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.cid).toBe(distributionData.cid);
      expect(response.body.location).toBe(distributionData.location);
      expect(response.body.amount).toBe(distributionData.amount);
      expect(response.body.description).toBe(distributionData.description);
    });

    test('should not allow donor to create a distribution', async () => {
      const distributionData = {
        cid: 'Qm123456789',
        location: 'Test Location',
        amount: 50,
        description: 'Test distribution'
      };

      const response = await request(app)
        .post('/api/distributions')
        .set('Authorization', `Bearer ${users.donor.token}`)
        .send(distributionData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/distributions', () => {
    test('should get all distributions', async () => {
      // Create a test distribution
      await Distribution.create({
        ngo: users.ngo.user._id,
        cid: 'Qm123456789',
        location: 'Test Location',
        amount: 50,
        description: 'Test distribution'
      });

      const response = await request(app)
        .get('/api/distributions')
        .set('Authorization', `Bearer ${users.donor.token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].cid).toBe('Qm123456789');
    });
  });

  describe('GET /api/distributions/ngo', () => {
    test('should get distributions for the current NGO', async () => {
      // Create two distributions (one for the NGO and one for another NGO)
      await Distribution.create({
        ngo: users.ngo.user._id,
        cid: 'Qm123456789',
        location: 'NGO Location 1',
        amount: 50,
        description: 'Distribution from our NGO'
      });

      // Create a test user with NGO role
      const anotherNgo = await mongoose.model('User').create({
        name: 'Another NGO',
        email: 'another@ngo.com',
        password: 'password123',
        role: 'ngo'
      });

      await Distribution.create({
        ngo: anotherNgo._id,
        cid: 'Qm987654321',
        location: 'NGO Location 2',
        amount: 75,
        description: 'Distribution from another NGO'
      });

      const response = await request(app)
        .get('/api/distributions/ngo')
        .set('Authorization', `Bearer ${users.ngo.token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].description).toBe('Distribution from our NGO');
    });

    test('should not allow donor to access ngo-specific endpoint', async () => {
      const response = await request(app)
        .get('/api/distributions/ngo')
        .set('Authorization', `Bearer ${users.donor.token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
