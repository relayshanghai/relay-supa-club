import { searchIntercepts, setupIntercepts } from './intercepts';
import cocomelon from '../../src/mocks/api/creators/report/cocomelon.json';
import defaultLandingPageInfluencerSearchRaw from '../../src/mocks/api/influencer-search/indexDefaultSearch';

import { resetUsages, supabaseClientCypress } from './helpers';
import { flattenInfluencerData } from 'src/utils/api/boostbot/helper';

const defaultLandingPageInfluencerSearch = flattenInfluencerData(defaultLandingPageInfluencerSearchRaw);
export { cocomelon, defaultLandingPageInfluencerSearch };

describe('Admin mode and search usages', () => {
    beforeEach(() => {
        setupIntercepts({ useRealUsages: true, useRealSequences: true });
        const supabase = supabaseClientCypress();

        new Cypress.Promise(async () => await resetUsages(supabase));

        searchIntercepts();
    });
    it('can record search usages, can manage clients as a company owner', () => {
        cy.loginAdmin();

        cy.getByTestId('layout-account-menu').click();
        cy.contains('My Account').click();
        cy.contains('Usage limits', { timeout: 30000 });
        cy.contains('https://relay.club', { timeout: 20000 });
        cy.contains('https://blue-moonlight-stream.com').should('not.exist');
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '0');
        });

        cy.contains('Classic').click();
        cy.contains('button', 'Search', { timeout: 10000 });

        // rack up 2 searches
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });
        cy.contains('alligators').click();

        cy.contains('button', 'Search').click();
        cy.contains('Brave Wilderness');

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').clear().type('monkeys');
        });
        cy.contains('monkeys').click();

        cy.get('span[id=remove-tag-alligators]').click(); // remove the alligators filter
        cy.contains('button', 'Search').click();
        cy.contains('Jungle Beat');

        cy.getByTestId('layout-account-menu').click();
        cy.contains('My Account').click();
        cy.contains('Usage limits', { timeout: 30000 });
        cy.contains('https://relay.club');

        // searches should have increased by 2
        cy.contains('td', '2', { timeout: 30000 }); // wait for count to update
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '2');
        });

        cy.contains('Clients').click();

        // check warning message
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises').should('not.exist');
        cy.contains('tr', 'Blue Moonlight Stream Enterprises', { timeout: 20000 }).within(() => {
            cy.contains('Manage').click();
        });
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises');

        // // can see client's sequences
        // cy.contains('CRM').click();
        // cy.contains('button', 'New sequence');
        // cy.contains('General collaboration', { timeout: 30000 }); // wait for campaigns to load
        // cy.contains('William Edward'); // manager of the sequence
        // cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists

        // // can see client's search totals
        // cy.getByTestId('layout-account-menu').click();
        // cy.contains('My Account').click();
        // cy.contains('https://blue-moonlight-stream.com', { timeout: 20000 });
        // cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists
        // cy.contains('tr', 'Searches').within(() => {
        //     cy.contains('td', '0'); // wait for count to update
        // });

        // // rack up 1 search
        // cy.contains('Classic').click();
        // cy.contains('button', 'Search');
        // cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists
        // cy.getByTestId('search-topics').within(() => {
        //     cy.get('input').type('alligators');
        // });
        // cy.contains('alligators').click();
        // cy.contains('button', 'Search').click();

        // // Check that search total increased
        // cy.getByTestId('layout-account-menu').click();
        // cy.contains('My Account').click();
        // cy.contains('https://blue-moonlight-stream.com');
        // cy.contains('td', '1', { timeout: 30000 }); // wait for count to update
        // cy.contains('tr', 'Searches').within(() => {
        //     cy.contains('td', '1');
        // });
        // cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists

        // can cancel out of manage mode
        cy.contains('Clients').click();
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises');
        cy.contains('Close', { timeout: 1000 }).click();
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises').should('not.exist');

        cy.getByTestId('layout-account-menu').click();
        cy.contains('My Account').click();
        cy.contains('https://blue-moonlight-stream.com').should('not.exist');
        cy.contains('https://relay.club');
    });
});
