import { deleteDB } from 'idb';
import { cocomelon, cocomelonId, defaultLandingPageInfluencerSearch, setupIntercepts } from './intercepts';

describe('Caches SWR requests', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });
    it('caches reports from `use-report`', () => {
        setupIntercepts(); // some will be overriden
        cy.loginTestUser();

        cy.contains('Campaigns', { timeout: 10000 });

        cy.getByTestId(`search-result-row-buttons/${cocomelonId}`).click({
            force: true,
        });
        cy.getByTestId(`analyze-button/${cocomelonId}`)
            .should('have.attr', 'target', '_blank')
            .should('have.attr', 'href', `/influencer/youtube/${cocomelonId}`);

        cy.intercept('/api/creators/report*', (req) => {
            req.reply({ body: cocomelon, delay: 3000 });
        });
        cy.visit(`influencer/youtube/${cocomelonId}`);

        cy.contains('Cocomelon - Nursery Rhymes').should('not.exist', { timeout: 2500 }); // report is not loaded yet

        cy.contains('Generating influencer Report. Please wait'); // loading analyze page
        cy.contains('Cocomelon - Nursery Rhymes'); // loads analyze page

        cy.intercept('/api/creators/report*', (req) => {
            req.reply({ body: cocomelon, delay: 10000 });
        });
        cy.reload();
        cy.contains('Campaigns', { timeout: 10000 }); // sidebar has loaded

        cy.contains('Cocomelon - Nursery Rhymes', { timeout: 2500 }); // loads report faster than it did before even though timeout is longer
    });
    it('caches searches on the dashboard', () => {
        setupIntercepts(); // some will be overriden
        cy.loginTestUser();
        cy.intercept('/api/influencer-search*', (req) => {
            req.reply({
                body: defaultLandingPageInfluencerSearch,
                delay: 1000,
            });
        });
        cy.contains('Cocomelon - Nursery Rhymes', { timeout: 1000 }).should('not.exist');
        cy.contains('Cocomelon - Nursery Rhymes', { timeout: 300000 }).should('exist');
        cy.intercept('/api/influencer-search*', (req) => {
            req.reply({
                body: defaultLandingPageInfluencerSearch,
                delay: 10000,
            });
        });
        cy.reload();
        cy.contains('Cocomelon - Nursery Rhymes').should('exist'); // even though the delay is 10 seconds, the search is cached
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
