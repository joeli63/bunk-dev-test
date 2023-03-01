import { app } from '../server';
import request from 'supertest';

describe('POST /payouts', () => {
  it('calculates payouts correctly', (done) => {
    const expenses = [
      { name: 'Adriana', amount: 5.75 },
      { name: 'Adriana', amount: 5.75 },
      { name: 'Bao', amount: 12 },
    ];

    request(app)
      .post('/payouts')
      .send({ expenses })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const { total, equalShare, payouts } = res.body;

        // Check that the total and equalShare are correct
        if (total !== 23.5) return done(new Error('Incorrect total'));
        if (equalShare !== 11.75) return done(new Error('Incorrect equalShare'));

        // Check that the payouts are correct
        if (payouts.length !== 1) return done(new Error('Incorrect number of payouts'));
        const payout = payouts[0];
        if (payout.owes !== 'Adriana') return done(new Error('Incorrect owes'));
        if (payout.owed !== 'Bao') return done(new Error('Incorrect owed'));
        if (payout.amount !== 0.25) return done(new Error('Incorrect amount'));

        done();
      });
  });
});
