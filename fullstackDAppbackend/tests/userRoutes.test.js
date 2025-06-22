const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const { connectTestDB, clearDatabase, disconnectDB, createTestUser } = require('./testUtils');

// Load test environment variables
require('./setup');

describe('User API Routes', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDB();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'donor'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role).toBe(userData.role);
    });

    test('should not register a user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'donor'
      };

      // Create a user first
      await User.create(userData);

      // Try to register another user with the same email
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    test('should login user with correct credentials', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'donor'
      };

      // Create a user first
      await User.create(userData);

      // Login
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    test('should not login with incorrect password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'donor'
      };

      // Create a user first
      await User.create(userData);

      // Try to login with wrong password
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/profile', () => {
    test('should get user profile when authenticated', async () => {
      // Create test user
      const { user, token } = await createTestUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'donor'
      });

      // Get profile
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(user.role);
    });

    test('should not allow access to profile without token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not authorized, no token');
    });
  });
});
