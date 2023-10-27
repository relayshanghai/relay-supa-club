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

        cy.contains("Hi, I'm BoostBot");
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
        cy.contains("Hi, I'm BoostBot");
        cy.contains('Generating topics and niches').should('not.exist');
        cy.contains('Browsing through millions of influencers in our database').should('not.exist');
        cy.contains(`I handpicked ${boostbotGetInfluencers.length * 3} influencers`).should('not.exist');

        cy.get('textarea').type('LED beauty mask{enter}');

        const checkExistingLoadingMessage = () => {
            cy.contains('Generating topics and niches');
            cy.contains('Browsing through millions of influencers in our database');
            cy.contains(`I handpicked ${boostbotGetInfluencers.length * 3} influencers`);
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
        cy.contains('Generating topics and niches');

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state. If we don't and the reload happens too fast, the state doesn't get persisted and gets lost.
        cy.reload();

        cy.contains('LED beauty mask'); // This proves that messages have correctly loaded from indexedDB
        cy.contains('Generating topics and niches').should('not.exist'); // And this proves that the unfinished messages have been removed
    });

    it('accepts limited filters and fetches influencers only for 1 platform', () => {
        cy.contains("Hi, I'm BoostBot");

        cy.getByTestId('boostbot-open-options').click();
        cy.getByTestId('boostbot-open-filters').click();

        cy.contains('Basic Filters');

        cy.getByTestId('boostbot-add-more-geos-button').click();
        cy.get('input').focus().type('Fra'); // Type into a suggestion input
        cy.contains('France').click(); // Add France geo by clicking a suggestion box item

        cy.getByTestId('boostbot-filter-instagram').click(); // By default, all platforms are enabled. We uncheck instagram and tiktok.
        cy.getByTestId('boostbot-filter-tiktok').click();

        cy.getByTestId(`boostbot-filter-geo-${countriesByCode.US.id}`).click(); // Remove default United States geo
        cy.getByTestId('boostbot-confirm-filters').click();

        cy.get('textarea').type('LED beauty mask{enter}'); // Do a search

        cy.intercept('POST', '/api/boostbot/get-influencers', (req) => {
            const { audience_geo } = req.body.searchPayloads[0].body.filter;

            const expectedCountryInclusion = { id: countriesByCode.FR.id, weight: 0.15 }; // Added France geo
            const unexpectedCountryInclusion = { id: countriesByCode.US.id, weight: 0.15 }; // Removed default US geo

            expect(audience_geo).to.deep.include(expectedCountryInclusion);
            expect(audience_geo).to.not.deep.include(unexpectedCountryInclusion);
        });

        cy.contains(`I handpicked ${boostbotGetInfluencers.length} influencers`); // boostbotGetInfluencers.length is only for one platform, which is correct. Default Boostbot search test above checks boostbotGetInfluencers.length * 3 for all three platforms.
    });
});

export {};
