import { cocomelonId, searchIntercepts, setupIntercepts } from './intercepts';
Cypress.on('uncaught:exception', (_err) => {
    // ignore hydration errors from the WordCloud component which is dynamically loaded
    return false;
});

describe('Dashboard/Search page', () => {
    beforeEach(() => {
        setupIntercepts();
        searchIntercepts();
    });

    it('can search for a topic', () => {
        cy.loginTestUser();
        cy.visit('/dashboard');
        cy.contains('Search by Topics', { timeout: 10000 });
        cy.getByTestId('platform-select-loading-youtube').should('exist');
        cy.getByTestId('platform-select-loading-youtube').should('not.exist');
        cy.contains('No credits remaining').should('not.exist');
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').should('be.visible').should('be.enabled').type('alligators');
        });
        cy.getByTestId('search-spinner').should('exist'); // wait for spinner to appear

        // cy.contains will not include the input element text in the search, so this shows that the result options are in the DOM
        cy.contains('alligators').click();

        cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to disappear
        cy.contains('button', 'Search').click();

        cy.contains('Brave Wilderness'); // the first influencer search result for alligators
    });

    it('can open analyze page', () => {
        cy.loginTestUser();
        cy.visit('/dashboard');

        cy.contains('Search by Topics', { timeout: 10000 });
        cy.getByTestId('platform-select-loading-youtube').should('exist');
        cy.getByTestId('platform-select-loading-youtube').should('not.exist');
        cy.contains('No credits remaining').should('not.exist');

        cy.getByTestId(`open-influencer-modal/${cocomelonId}`, { timeout: 10000 }).click();

        cy.contains(`Unlock Detailed Analysis Report`, { timeout: 10000 })
            .should('have.attr', 'target', '_blank')
            .should('have.attr', 'href', `/influencer/youtube/${cocomelonId}`);
        cy.visit(`influencer/youtube/${cocomelonId}`);
        cy.contains('Generating influencer Report. Please wait'); // loading analyze page
        cy.contains('Contact influencer'); // loads analyze page

        cy.contains('Channel Stats');
        cy.contains("Cocomelon - Nursery Rhymes's Report");
        cy.contains('Cocomelon - Nursery Rhymes');
        cy.contains('Similar Influencers');
        cy.contains('Shorts Factory');
    });
});

export {};
