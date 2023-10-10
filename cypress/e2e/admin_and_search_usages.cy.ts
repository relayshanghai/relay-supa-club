import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';
import cocomelon from '../../src/mocks/api/creators/report/cocomelon.json';
import defaultLandingPageInfluencerSearch from '../../src/mocks/api/influencer-search/indexDefaultSearch.json';
import influencerSearch from '../../src/mocks/api/influencer-search/searchByInfluencerGRTR.json';
import keywordSearch from '../../src/mocks/api/influencer-search/keywordSearchAlligators.json';
import keywordSearchMonkeys from '../../src/mocks/api/influencer-search/keywordSearchMonkeys.json';

import type { InfluencerPostRequest } from 'pages/api/influencer-search';
import type { UsagesDBInsert } from 'src/utils/api/db';
import { ulid } from 'ulid';
import { resetUsages, supabaseClientCypress } from './helpers';
export { cocomelon, defaultLandingPageInfluencerSearch };

const now = new Date();
const usagesIntercepts = () => {
    cy.intercept('POST', '/api/influencer-search*', (req) => {
        const supabase = supabaseClientCypress();
        const body: InfluencerPostRequest = req.body;
        const justNow = new Date(); // lets do 18 hours ago to be safe if the test is running in another timezone
        const eighteenHours = 18 * 60 * 60 * 1000;
        justNow.setTime(now.getTime() - eighteenHours);
        const usage: UsagesDBInsert = {
            company_id: body.company_id,
            user_id: body.user_id,
            type: 'search',
            item_id: ulid(),
            created_at: justNow.toISOString(),
        };
        // cy.log(JSON.stringify(usage));
        if (body.username === 'GRTR' || body.text === 'GRTR') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    return req.reply({
                        body: influencerSearch,
                    });
                });
        } else if (body.tags && body.tags[0]?.tag === 'alligators') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    return req.reply({
                        body: keywordSearch,
                    });
                });
        } else if (body.tags && body.tags[0]?.tag === 'monkeys') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    return req.reply({
                        body: keywordSearchMonkeys,
                    });
                });
        } else {
            return req.reply({
                body: defaultLandingPageInfluencerSearch,
            });
        }
    });
    cy.intercept('/api/influencer-search/topics*', (req) => {
        const body = req.body;
        if (body.term === 'alligators') {
            req.reply({
                body: {
                    success: true,
                    data: [
                        { tag: 'alligator', value: 'alligator' },
                        { tag: 'alligators', value: 'alligators' },
                        { tag: 'alligator_attack', value: 'alligator attack' },
                    ],
                },
                delay: 1000,
            });
        } else if (body.term === 'monkeys') {
            req.reply({
                body: {
                    data: [
                        { tag: 'monkeys', value: 'monkeys' },
                        { tag: 'arctic_monkeys', value: 'arctic monkeys' },
                        { tag: 'five_little_monkeys', value: 'five little monkeys' },
                        { tag: 'funny_monkeys', value: 'funny monkeys' },
                        { tag: 'monkeys_jumping_on_the_bed', value: 'monkeys jumping on the bed' },
                    ],
                    success: true,
                },
                delay: 1000,
            });
        } else {
            req.reply({
                body: {
                    success: true,
                    data: [],
                },
            });
        }
    });
};

describe('Admin mode and search usages', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        setupIntercepts({ useRealUsages: true, useRealSequences: true });
        const supabase = supabaseClientCypress();

        new Cypress.Promise(async () => await resetUsages(supabase));

        usagesIntercepts();
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

        cy.contains('Discover').click();
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

        // can see client's sequences
        cy.contains('Sequences').click();
        cy.contains('button', 'New sequence');
        cy.contains('General collaboration', { timeout: 30000 }); // wait for campaigns to load
        cy.contains('William Edward'); // manager of the sequence
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists

        // can see client's search totals
        cy.getByTestId('layout-account-menu').click();
        cy.contains('My Account').click();
        cy.contains('https://blue-moonlight-stream.com', { timeout: 20000 });
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '0'); // wait for count to update
        });

        // rack up 1 search
        cy.contains('Discover').click();
        cy.contains('button', 'Search');
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });
        cy.contains('alligators').click();
        cy.contains('button', 'Search').click();

        // Check that search total increased
        cy.getByTestId('layout-account-menu').click();
        cy.contains('My Account').click();
        cy.contains('https://blue-moonlight-stream.com');
        cy.contains('td', '1', { timeout: 30000 }); // wait for count to update
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '1');
        });
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists

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
