import { deleteDB } from 'idb';
import { addPostIntercept, cocomelonId, setupIntercepts } from './intercepts';

describe('Main pages happy paths', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });

    it('can log in and load search page and switch language', () => {
        setupIntercepts();
        cy.visit('/');

        localStorage.setItem('language', 'zh-CN');
        // starts on signup page. has an h1 that says signup in Chinese: 注册
        cy.get('h1').contains('注册');

        cy.loginTestUser();

        cy.contains('Campaigns'); // dashboard page load
        cy.url().should('include', '/dashboard');
    });
    it('can search for an influencer', () => {
        setupIntercepts();

        cy.loginTestUser();
        // cy.get('input[type="checkbox').uncheck({ force: true }); // turn off the Recommended Only
        // wait for search results
        cy.contains('T-Series'); // the first influencer search result

        // search for an influencer
        // ensure GRTR is not in the search results
        cy.contains('GRTR').should('not.exist');

        cy.getByTestId('creator-search').type('GRTR{enter}');
        cy.wait(2000); // due to some funky rerendering, so button click doesn't work immediately

        cy.contains('button', 'Search').click(); // click twice
        cy.contains('GRTR');
    });
    it('can search for a topic', () => {
        setupIntercepts();

        cy.loginTestUser();
        cy.get('input[type="checkbox').uncheck({ force: true }); // turn off the Recommended Only

        // // wait for search results
        // cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });

        cy.getByTestId('search-spinner').should('exist'); // wait for spinner to appear

        // cy.contains will not include the input element text in the search, so this shows that the result options are in the DOM
        cy.contains('alligators').click();

        cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to disappear
        cy.contains('button', 'Search').click();

        cy.contains('Brave Wilderness'); // the first influencer search result for alligators
    });
    it('can open analyze page', () => {
        setupIntercepts();

        cy.loginTestUser();

        cy.getByTestId(`search-result-row-buttons/${cocomelonId}`).click({
            force: true,
        });

        cy.getByTestId(`analyze-button/${cocomelonId}`)
            .should('have.attr', 'target', '_blank')
            .should('have.attr', 'href', `/influencer/youtube/${cocomelonId}`);
        cy.visit(`influencer/youtube/${cocomelonId}`);
        cy.contains('Generating influencer Report. Please wait'); // loading analyze page
        cy.contains('Contact influencer'); // loads analyze page

        cy.contains('Channel Stats');
        cy.contains('Cocomelon - Nursery Rhymes');
        cy.contains('Similar Influencers');
        cy.contains('Shorts Factory');

        cy.contains('button', 'Add To Campaign').click();
        cy.contains('Add this influencer to your existing campaigns');
        cy.contains('Beauty for All Skin Tones'); // this functionality is tested in campaigns page test
    });
    it('can use account and pricing pages', () => {
        setupIntercepts();

        cy.loginTestUser();
        cy.contains('Account').click();
        cy.contains('Subscription', { timeout: 10000 }); // loads account page

        cy.url().should('include', `/account`);
        // user info
        cy.contains('First name');
        cy.contains('William Edward');
        cy.contains('Company name');
        cy.contains('Blue Moonlight Stream Enterprises');

        // open one of the modals
        cy.contains('button', 'Add more members').click();
        cy.contains('Invite Members');
        cy.contains('button', /Cancel/).click();
        cy.contains('Invite Members').should('not.exist');

        // upgrade subscription links to pricing page
        cy.contains('button', 'Upgrade subscription').click(); // loads subscription data
        cy.contains('Choose the best plan for you', { timeout: 10000 }); // loads pricing page
        cy.url().should('include', `/pricing`);
        cy.contains('DIY Max');
        // this doesn't work anymore because we aren't using a live account anymore, so stripe sends back 'can't find subscription' and the button is disabled.
        // TODO: fix this when we implement msw mocks, mock the stripe call/response.
        // cy.contains('button', 'Buy Now').click();
        // cy.contains('button', 'Subscribe');
        // cy.contains('button', 'Close').click();
        // cy.contains('button', 'Subscribe').should('not.exist');
    });
    it('can open ai email generator', () => {
        setupIntercepts();

        // not actually testing functionality of the email generator. Just making sure the page opens.
        cy.loginTestUser();
        cy.contains('AI Email Generator').click();
        cy.contains('Generate emails to influencers with our AI Email Generator', {
            timeout: 10000,
        }); // loads ai email generator page
        cy.url().should('include', `/ai-email-generator`);
        // pre-populates the brand name. can interact with form.
        cy.get(`input[placeholder="Your Brand's Name"]`)
            .should('have.value', 'Blue Moonlight Stream Enterprises')
            .type('123')
            .should('have.value', 'Blue Moonlight Stream Enterprises123');
    });
    it('can open campaigns page and manage campaign influencers', () => {
        setupIntercepts();
        // list, add, archive campaigns
        // list, add, move, delete campaign influencers

        cy.loginTestUser();
        cy.contains('Campaigns').click();
        cy.contains('button', 'New Campaign', { timeout: 20000 }); // loads campaigns page
        cy.url().should('include', `/campaigns`);

        // campaigns listed
        cy.contains('My Campaign').should('not.exist');
        cy.contains('Beauty for All Skin Tones').click();

        // campaign details
        cy.contains('Campaign Launch Date', { timeout: 10000 });
        // shows influencers
        cy.contains('@Greg Renko');
        cy.contains('View Contact Info');
        cy.contains('SET India').should('not.exist');

        cy.go(-1);
        cy.get('button').contains('New Campaign', { timeout: 10000 }).click();

        // new campaign form
        cy.contains('Campaign Name *', { timeout: 10000 });
        // check displays new campaign
        cy.get('input[name=name]').type('My Campaign');
        cy.get('textarea[name=description]').type('This campaign is about selling some stuff');
        cy.get('input[name=product_name]').type('Gadget');
        cy.get('input[id=react-select-3-input]').click();
        cy.contains('Books').click();
        cy.get('input[id=react-select-5-input]').click();
        cy.contains('Albania').click();
        cy.get('input[name=budget_cents]').type('1000');
        cy.get('input[name=promo_types]').check({ force: true });
        cy.get('button').contains('Create Campaign').click();
        cy.contains('Campaign Launch Date', { timeout: 10000 });
        cy.contains('SET India').should('not.exist');

        cy.contains('My Campaign').click();

        // go to search and add an influencer to campaign
        cy.contains('Add New Influencer').click();
        cy.get('input[type="checkbox').uncheck({ force: true }); // turn off the Recommended Only

        cy.contains('tr', 'SET India', { timeout: 30000 }).contains('Add to campaign').click(); // not sure why this is still slow
        cy.contains('Beauty for All Skin Tones');
        cy.getByTestId('add-creator-button:Beauty for All Skin Tones').click();

        cy.contains('Campaigns').click({ force: true }); // hidden by modal
        cy.contains('Influencer added successfully.', { timeout: 60000 });
        cy.get('button').contains('New Campaign');
        cy.contains('Beauty for All Skin Tones').click();

        // move influencer to new campaign

        cy.contains('tr', 'SET India', { timeout: 60000 }).within(() =>
            cy.getByTestId('move-influencer-button').click(),
        ); // can take

        cy.getByTestId('move-influencer-button:My Campaign').click();
        cy.contains('Campaign Launch Date').click({ force: true }); // click out of modal
        cy.contains('SET India').should('not.exist');
        cy.contains('Campaigns').click();
        cy.contains('My Campaign').click();
        cy.contains('SET India');

        // change influencer status, and change status tabs
        cy.getByTestId('status-dropdown').select('Contacted', { force: true });
        cy.contains('Influencer Information Updated', { timeout: 10000 });
        cy.contains('SET India').should('not.exist');
        cy.contains('Contacted 1').click();
        cy.contains('SET India');

        // add notes

        cy.getByTestId('manage-button').click();
        cy.contains('Notes');
        cy.getByTestId('show-influencer-notes').click();

        cy.contains('Internal Comments');
        cy.get('textarea').type('This influencer is great');
        cy.contains('William Edward').should('not.exist'); // user name doesn't show

        cy.getByTestId('submit-comment-button').click();
        cy.contains('William Edward', { timeout: 10000 }); // user name shows
        cy.contains('This influencer is great');
        cy.contains('My Campaign').click({ force: true }); // hidden by modal
        // delete an influencer
        cy.getByTestId('delete-creator').click();
        cy.contains('Influencer was deleted.');
        cy.contains('SET India').should('not.exist');

        // archive a campaign
        cy.contains('span', 'Archive').click();
        cy.contains('Campaigns').click();
        cy.contains('My Campaign').should('not.exist');
        cy.contains('Archived Campaigns').click();
        cy.contains('My Campaign');
    });
    it('can add influencers to campaign', () => {
        setupIntercepts();

        cy.loginTestUser();
        cy.findByTestId('add-to-campaign-button/UCq-Fj5jknLsUf-MWSy4_brA').click();
        cy.findByTestId('add-creator-button:Beauty for All Skin Tones').click();
        cy.wait(1000);
        cy.visit('/campaigns');
        cy.contains('Beauty for All Skin Tones').click();
        cy.wait(1000);
        cy.get('table tr td').should(($cells) => {
            const cellTexts = $cells.toArray().map((cell) => cell.innerText);
            const isSorted = cellTexts.every((value, index) => {
                if (index === 0 && value !== 'T-Series\n@tseries') {
                    return false;
                }

                return true;
            });
            expect(isSorted).to.be.true;
        });
    });
    it.only('can sort campaigns by last edited', () => {
        setupIntercepts();

        cy.loginTestUser();

        cy.contains('Campaigns').click();
        cy.contains('Beauty for All Skin Tones').click();
        cy.contains('button', 'New Campaign', { timeout: 20000 }); // loads campaigns page
        cy.url().should('include', `/campaigns`);
        // campaigns listed
        cy.contains('Campaign Test').should('not.exist');
        cy.contains('Campaign Second Test').should('not.exist');
        cy.contains('Beauty for All Skin Tones').click();
        // campaign details
        cy.contains('Campaign Launch Date', { timeout: 10000 });
        // shows influencers
        cy.contains('@Greg Renko');
        cy.contains('View Contact Info');
        cy.contains('SET India').should('not.exist');
        cy.go(-1);

        // CREATE NEW CAMPAIGN
        cy.get('button').contains('New Campaign', { timeout: 10000 }).click();
        // new campaign form
        cy.contains('Campaign Name *', { timeout: 10000 });
        // check displays new campaign
        cy.get('input[name=name]').type('Campaign Test');
        cy.get('textarea[name=description]').type('This campaign is about selling some stuff');
        cy.get('input[name=product_name]').type('Gadget');
        cy.get('input[id=react-select-3-input]').click();
        cy.contains('Books').click();
        cy.get('input[id=react-select-5-input]').click();
        cy.contains('Albania').click();
        cy.get('input[name=budget_cents]').type('1000');
        cy.get('input[name=promo_types]').check({ force: true });
        cy.get('button').contains('Create Campaign').click();
        cy.contains('Campaign Launch Date', { timeout: 10000 });
        cy.contains('SET India').should('not.exist');

        cy.go(-1);

        // new campaign form
        cy.contains('Campaign Name *', { timeout: 10000 });
        // check displays new campaign
        cy.get('input[name=name]').type('Campaign Second Test');
        cy.get('textarea[name=description]').type('This campaign is about buying some stuff');
        cy.get('input[name=product_name]').type('ABC');
        cy.getByTestId('tag_list').click();
        cy.contains('Books').click();
        cy.getByTestId('target_locations').click();
        cy.contains('Austria').click();
        cy.get('input[name=budget_cents]').type('1000');
        cy.get('input[name=promo_types]').check({ force: true });
        cy.get('button').contains('Create Campaign').click();
        cy.contains('Campaign Launch Date', { timeout: 10000 });
        cy.contains('SET India').should('not.exist');

        cy.contains('Campaigns').click();

        const divs = cy.get('.grid > div');
        divs.then(($divs) => {
            const divArray = [...$divs];
            const isSorted = divArray.every((div, index) => {
                const id = div.id;
                if (index === 0 && id !== 'campaign-card-campaign-second-test') {
                    return false;
                }
                if (index === 1 && id !== 'campaign-card-campaign-test') {
                    return false;
                }
                return true;
            });

            expect(isSorted).to.be.true;
        });
    });

    /** works on local... 🤷‍♂️ */
    it.skip('can log out', () => {
        setupIntercepts();

        cy.loginTestUser();
        cy.getByTestId('layout-account-menu').click();
        cy.contains('Log Out').click();
        cy.contains('Log in'); // loads login page
        cy.url().should('include', `/login`);

        // pre-populates email with original email
        cy.get('input[type="email"]').should('have.value', Cypress.env('TEST_USER_EMAIL_COMPANY_OWNER'));
    });
    it('Can add post URLs to campaign influencers and see their posts performance updated on the performance page', () => {
        addPostIntercept();
        // check 'before' performance page totals
        cy.loginTestUser();
        cy.contains('Performance').click();
        cy.contains('All campaigns', { timeout: 20000 });
        cy.contains('div', 'Likes').within(() => {
            cy.contains('166.5K').should('not.exist');
            cy.contains('26.0K');
        });
        cy.contains('div', 'Comments').within(() => {
            cy.contains('2.8K').should('not.exist');
            cy.contains('166.5K');
        });
        cy.contains('div', 'Views').within(() => {
            cy.contains('96.2K');
        });

        cy.contains('Campaigns').click();
        cy.contains('Beauty for All Skin Tones').click();
        cy.getByTestId('status-dropdown').select('Posted', { force: true });
        cy.contains('Posted 1').click();
        cy.contains('Content').click();
        cy.contains('h2', 'Manage Posts');

        const youtubeLink = 'https://www.youtube.com/watch?v=UzL-0vZ5-wk';
        cy.contains('form', 'Add Post URL').within(() => {
            cy.get('input').type(youtubeLink);
            cy.get('button').contains('Submit').should('not.be.disabled').click();
        });

        cy.contains('Successfully added 1 URLs');
        cy.getByTestId('status-dropdown').select('To Contact', { force: true });

        // check 'after' performance page totals
        cy.contains('Performance').click();
        cy.contains('All campaigns', { timeout: 20000 });
        cy.contains('div', 'Likes').within(() => {
            cy.contains('166.5K').should('not.exist');
            cy.contains('27.0K');
        });
        cy.contains('div', 'Comments').within(() => {
            cy.contains('2.8K').should('not.exist');
            cy.contains('167.5K');
        });
        cy.contains('div', 'Views').within(() => {
            cy.contains('97.2K');
        });
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
