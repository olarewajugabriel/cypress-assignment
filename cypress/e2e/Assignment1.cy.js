describe('SauceDemo Login Tests - Assignment 1', () => {
  let userData;

  beforeEach(() => {
    cy.fixture('users').then((data) => {
      userData = data;
    });
    cy.visit('https://www.saucedemo.com/');
  });

  it('should log in successfully as standard_user', () => {
    cy.get('[data-test="username"]').type(userData.standardUser);
    cy.get('[data-test="password"]').type(userData.password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should display an error message for locked_out_user', () => {
    cy.get('[data-test="username"]').type(userData.lockedOutUser);
    cy.get('[data-test="password"]').type(userData.password);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Sorry, this user has been locked out');
  });

  it('should log in as problem_user', () => {
    cy.get('[data-test="username"]').type(userData.problemUser);
    cy.get('[data-test="password"]').type(userData.password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should log in as performance_glitch_user', () => {
    cy.get('[data-test="username"]').type(userData.performanceGlitchUser);
    cy.get('[data-test="password"]').type(userData.password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });
});