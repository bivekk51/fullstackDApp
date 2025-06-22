const request = require('supertest');
const app = require('../index');
const { connectTestDB, clearDatabase, disconnectDB } = require('./testUtils');

// Load test environment variables
require('./setup');

describe('App Core', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDB();
  });

  describe('GET /', () => {
    test('should respond with API is running', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('API is running');
    });
  });

  describe('Route not found', () => {
    test('should handle undefined routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.statusCode).toBe(404);
    });
  });
});
