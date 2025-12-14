import request from 'supertest';
import app from '../app';

describe('GET /api/health', () => {
  it('should return 200 with status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'OK' });
  });
});
