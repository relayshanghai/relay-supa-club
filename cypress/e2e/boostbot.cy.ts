import { deleteDB } from 'idb';
import { numberFormatter } from 'src/utils/formatter';
import { boostbotIntercepts, setupIntercepts } from './intercepts';
import danniCreatorReport from '../../src/mocks/api/creators/report/danni.json';
import boostbotGetInfluencers from '../../src/mocks/api/boostbot/get-influencers.json';
import { countriesByCode } from 'src/utils/api/iqdata/dictionaries/geolocations';

describe('Boostbot', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        deleteDB('app-store');
        setupIntercepts();
        boostbotIntercepts();

        cy.loginTestUser();
        cy.visit('/boostbot');
    });

    it('displays no results when no influencers found', () => {
        cy.intercept('POST', '/api/boostbot/get-influencers', { body: [] });

        cy.contains("Hi I'm BoostBot");
        cy.contains("I can't seem to find influencers under your selected filters").should('not.exist');

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains("I can't seem to find influencers under your selected filters");
        cy.contains('No results');
    });

    it('can search for a list of influencers and display results', () => {
        const { fullname, followers } = danniCreatorReport.user_profile;
        const influencerName = fullname;
        const formattedFollowers = String(numberFormatter(followers));

        cy.contains(influencerName).should('not.exist');
        cy.contains(formattedFollowers).should('not.exist');

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains(influencerName);
        cy.contains(formattedFollowers);
        cy.contains('@DANNIVIVIANI');
    });

    it('can persist chat messages and influencer result states across reloads', () => {
        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('@DANNIVIVIANI');

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state. If we don't and the reload happens too fast, the state doesn't get persisted and gets lost.
        cy.reload();

        cy.contains('LED beauty mask');
        cy.contains('@DANNIVIVIANI');
    });

    it('persists finished loading progress messages', () => {
        cy.contains("Hi I'm BoostBot");
        cy.contains('Finding niches for your product').should('not.exist');
        cy.contains('Searching our database for relevant influencers').should('not.exist');
        cy.contains('Select the influencers').should('not.exist');

        cy.get('textarea').type('LED beauty mask{enter}');

        const checkExistingLoadingMessage = () => {
            cy.contains('Finding niches for your product');
            cy.contains('Searching our database for relevant influencers');
            cy.contains('Select the influencers');
        };

        checkExistingLoadingMessage();

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state. If we don't and the reload happens too fast, the state doesn't get persisted and gets lost.
        cy.reload();

        checkExistingLoadingMessage();
    });

    it('does not persist unfinished loading progress messages', () => {
        cy.intercept('POST', '/api/boostbot/get-influencers', { body: boostbotGetInfluencers, delay: 2000 });

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('LED beauty mask');
        cy.contains('Finding niches for your product');

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state. If we don't and the reload happens too fast, the state doesn't get persisted and gets lost.
        cy.reload();

        cy.contains('LED beauty mask'); // This proves that messages have correctly loaded from indexedDB
        cy.contains('Finding niches for your product').should('not.exist'); // And this proves that the unfinished messages have been removed
    });

    /** TODO: fix https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1133 */
    it.skip('accepts limited filters and fetches influencers only for 1 platform', () => {
        cy.contains("Hi I'm BoostBot");

        cy.getByTestId('boostbot-open-filters').click();

        cy.contains('Search Filters');

        cy.getByTestId('boostbot-filter-instagram').click(); // By default, all platforms are enabled. We uncheck instagram and tiktok.
        cy.getByTestId('boostbot-filter-tiktok').click();

        cy.getByTestId(`boostbot-filter-geo-${countriesByCode.US.id}`).click(); // Remove default United States geo
        cy.getByTestId('boostbot-geo-container').find('input').focus().type('Fra');
        cy.contains('France').click();
        cy.getByTestId('boostbot-confirm-filters').click();

        cy.get('textarea').type('LED beauty mask{enter}'); // Do a search

        cy.intercept('POST', '/api/boostbot/get-influencers', (req) => {
            const { audience_geo } = req.body.searchPayloads[0].body.filter;

            const expectedCountryInclusion = { id: countriesByCode.FR.id, weight: 0.02 }; // Added France geo
            const unexpectedCountryInclusion = { id: countriesByCode.US.id, weight: 0.2 }; // Removed default US geo

            expect(audience_geo).to.deep.include(expectedCountryInclusion);
            expect(audience_geo).to.not.deep.include(unexpectedCountryInclusion);
        });

        cy.contains('Select the influencers');
    });
});

export {};
