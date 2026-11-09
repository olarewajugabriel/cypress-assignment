describe('SauceDemo Automation Assignment', () => {

  const username = 'standard_user';
  const password = 'secret_sauce';

  const login = () => {
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  };

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  it('01 - Login with invalid credentials', () => {
    cy.get('[data-test="username"]').type('wrong_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('be.visible');
  });

  it('02 - Login with valid credentials', () => {
    login();
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
  });

  it('03 - Filter products from A to Z', () => {
    login();

    cy.get('[data-test="product-sort-container"]').select('az');

    cy.get('.inventory_item_name').then(($names) => {
      const names = [...$names].map((el) => el.innerText);
      expect(names).to.deep.equal([...names].sort());
    });
  });

  it('04 - Filter products from low to high', () => {
    login();

    cy.get('[data-test="product-sort-container"]').select('lohi');

    cy.get('.inventory_item_price').then(($prices) => {
      const prices = [...$prices].map((el) =>
        Number(el.innerText.replace('$', ''))
      );

      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
    });
  });

  it('05 - Add a product to cart', () => {
    login();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('06 - Remove two products from cart', () => {
    login();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    cy.get('.shopping_cart_badge').should('have.text', '2');
    cy.get('.shopping_cart_link').click();

    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click();

    cy.get('.cart_item').should('have.length', 0);
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('07 - Proceed to checkout', () => {
    login();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();

    cy.url().should('include', '/checkout-step-one.html');
    cy.get('[data-test="firstName"]').should('be.visible');
  });

  it('08 - Complete checkout', () => {
    login();

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type('Gabriel');
    cy.get('[data-test="lastName"]').type('Tester');
    cy.get('[data-test="postalCode"]').type('100001');
    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="finish"]').click();

    cy.get('[data-test="complete-header"]')
      .should('contain.text', 'Thank you for your order!');
  });

});