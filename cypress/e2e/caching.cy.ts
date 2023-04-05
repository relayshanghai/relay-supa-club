describe('Main pages happy paths', () => {
    it('can log in and load search page and switch language', () => {
        cy.loginTestUser();

        cy.contains('Campaigns', { timeout: 10000 });
        const tSeriesID = 'UCq-Fj5jknLsUf-MWSy4_brA';

        cy.getByTestId(`search-result-row-buttons/${tSeriesID}`, { timeout: 10000 }).click({
            force: true,
        });

        cy.getByTestId(`analyze-button/${tSeriesID}`)
            .should('have.attr', 'target', '_blank')
            .invoke('removeAttr', 'target') // remove target attribute so we can click it and stay on the same page
            .click({ force: true }); // force click because the button is hidden because of our weird hover UI

        cy.contains("T-Series is India's largest Music Label", { timeout: 1000 }).should('not.exist'); // report is not loaded yet

        cy.contains('Generating influencer Report. Please wait', { timeout: 30000 }); // loading analyze page
        cy.contains("T-Series is India's largest Music Label", { timeout: 30000 }); // loads analyze page

        cy.reload();

        cy.contains('Campaigns', { timeout: 10000 }); // sidebar has loaded

        cy.contains("T-Series is India's largest Music Label", { timeout: 1000 }); // loads report super fast
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
