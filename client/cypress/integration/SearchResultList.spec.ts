import { beforeEach, describe, it } from 'local-cypress';

describe('Search vaccine data', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000');
  });
  it('entering valid date and searching shows correct results', function () {
    cy.get('#date-picker-inline').clear().type('04122021');
    cy.get('#time-picker').type('111006');
    cy.get('#search-button').click();
    cy.get('#expired-before-usage').contains('18');
  });
  it('entering valid date and searching with different values shows correct results', function () {
    cy.get('#date-picker-inline').clear().type('02022021');
    cy.get('#time-picker').type('121212');
    cy.get('#search-button').click();
    cy.get('#orders-arrived-total').contains('3');
  });
  it('typing invalid dates and times are ignored and app does not crash, clicking search with invalid values shows results for default date and time', function () {
    cy.get('#date-picker-inline').clear().type('asda923');
    cy.get('#time-picker').clear().type('55aa12');
    cy.contains('Search vaccine data');
    cy.get('#search-button').click();
    cy.get('#expired-before-usage').contains('18');
  });
});
