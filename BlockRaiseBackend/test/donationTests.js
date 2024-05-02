import request from 'supertest';
import chai from 'chai';
import app from '../app'; 

const expect = chai.expect;

describe('POST /campaign/:id/donate', function() {
  it('should allow a user to donate to a campaign', async function() {
    const response = await request(app)
      .post('/campaign/1/donate') 
      .send({ amount: '0.1' }) 
      .expect(201);

    expect(response.body).to.have.property('message', 'Donation successful');
    expect(response.body).to.have.property('transactionId');
  });

  it('should fail for non-existent campaign', async function() {
    const response = await request(app)
      .post('/campaign/999/donate') 
      .send({ amount: '0.1' })
      .expect(500); 

    expect(response.body).to.have.property('message', 'Donation failed');
  });
});
