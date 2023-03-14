describe('template spec', () => {
    it('passes', () => {
        cy.visit('/');
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
