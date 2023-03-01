describe('Holiday Expenses Calculator API', () => {
    const apiUrl = Cypress.env('API_URL');
  
    it('calculates payouts for expenses', () => {
      cy.request('POST', `${apiUrl}/payouts`, {
        expenses: [
          { name: 'Adriana', amount: 5.75 },
          { name: 'Adriana', amount: 5.75 },
          { name: 'Bao', amount: 12 },
        ],
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.total).to.eq(23.5);
        expect(response.body.equalShare).to.eq(11.75);
        expect(response.body.payouts).to.have.lengthOf(1);
        expect(response.body.payouts[0]).to.deep.eq({
          owes: 'Adriana',
          owed: 'Bao',
          amount: 0.25,
        });
      });
    });
  
    it('returns 400 when expenses are not provided', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/payouts`,
        failOnStatusCode: false,
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message', 'Expenses are required.');
      });
    });
  
    it('returns 400 when expense amount is not a number', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/payouts`,
        failOnStatusCode: false,
        body: {
          expenses: [
            { name: 'Adriana', amount: 'five dollars' },
          ],
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message', 'Expense amount must be a number.');
      });
    });
  
    it('returns 400 when expense name is not a string', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/payouts`,
        failOnStatusCode: false,
        body: {
          expenses: [
            { name: 123, amount: 5 },
          ],
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message', 'Expense name must be a string.');
      });
    });
  });
  