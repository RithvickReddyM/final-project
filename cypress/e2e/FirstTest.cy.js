describe('template spec', () => {


  //this is the e2e test
  it('passes', () => {
    cy.visit('http://159.203.124.196:3000')
    cy.url().should('eq', 'http://159.203.124.196:3000/signin');

    cy.get('input[type="email"]').type('sai@gmail.com');
    cy.get('input[type="password"]').type('1234');

    // Click the sign-in button
    cy.get('button[type="submit"]').click();

    // Assert that the user is redirected to the home page or another expected page
    cy.url().should('eq', 'http://159.203.124.196:3000/');

  })

})