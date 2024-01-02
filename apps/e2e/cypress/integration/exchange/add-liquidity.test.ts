describe('Add Liquidity', () => {
  it('loads the two correct tokens', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'WDNERO')
    cy.get('#add-liquidity-select-tokenb #pair').should('contain.text', 'BUSD')
    cy.getBySel('choose-pair-next').click({ force: true })
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WDNERO')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'BUSD')
  })

  it('loads the DTOKEN and tokens', () => {
    cy.visit('/add/DTOKEN/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'DTOKEN')
    cy.get('#add-liquidity-select-tokenb #pair').should('contain.text', 'WDNERO')
    cy.getBySel('choose-pair-next').click({ force: true })
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'DTOKEN')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WDNERO')
  })

  it('loads the WDTOKEN and tokens', () => {
    cy.visit('/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'WDTOKEN')
    cy.get('#add-liquidity-select-tokenb #pair').should('contain.text', 'WDNERO')
    cy.getBySel('choose-pair-next').click({ force: true })
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WDTOKEN')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WDNERO')
  })

  it('does not crash if DTOKEN is duplicated', () => {
    cy.visit('/add/DTOKEN/DTOKEN')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'DTOKEN')
    cy.get('#add-liquidity-select-tokenb #pair').should('not.contain.text', 'DTOKEN')
  })

  it('does not crash if address is duplicated', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'WDNERO')
    cy.get('#add-liquidity-select-tokenb #pair').should('not.contain.text', 'WDNERO')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/add/0xD74b782E05AA25c50e7330Af541d46E18f36661C/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'QUACK')
    cy.get('#add-liquidity-select-tokenb #pair').should('contain.text', 'WDNERO')
    cy.getBySel('choose-pair-next').click({ force: true })
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'QUACK')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WDNERO')
  })

  it('single token can be selected', () => {
    cy.visit('/add/0xD74b782E05AA25c50e7330Af541d46E18f36661C')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'QUACK')
    cy.visit('/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'BUSD')
    cy.visit('/add/DTOKEN')
    cy.get('#add-liquidity-select-tokena #pair').should('contain.text', 'DTOKEN')
  })

  it('redirects /add/token-token to add/token/token', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.url().should(
      'contain',
      '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    )
  })

  it('redirects /add/DTOKEN-token to /add/DTOKEN/token', () => {
    cy.visit('/add/DTOKEN-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.url().should('contain', '/add/DTOKEN/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
  })

  it('redirects /add/token-DTOKEN to /add/token/DTOKEN', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-DTOKEN')
    cy.url().should('contain', '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/DTOKEN')
  })

  it('redirects /add/WDTOKEN to /add/WDTOKEN/token', () => {
    cy.visit('/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.url().should(
      'contain',
      '/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    )
  })

  it('redirects /add/token-WDTOKEN to /add/token/WDTOKEN', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
    cy.url().should(
      'contain',
      '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    )
  })
})
