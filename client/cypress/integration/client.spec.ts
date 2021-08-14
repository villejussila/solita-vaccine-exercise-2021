import { describe, it } from 'local-cypress';

describe('Client', function () {
  it('front page can be opened', function () {
    cy.visit('http://localhost:3000');
    cy.contains('Search vaccine data');
  });
});
