import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';

describe('GET /api/health', function () {
  it('responds with ok status and timestamp', async function () {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('timestamp');
  });
});
