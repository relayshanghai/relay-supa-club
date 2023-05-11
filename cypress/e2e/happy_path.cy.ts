import { deleteDB } from 'idb';

describe('Main pages happy paths', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });
    it('can log in and load search page and switch language', () => {
        cy.visit('/');
        localStorage.setItem('language', 'zh');
        // starts on signup page. has an h1 that says signup in Chinese: 注册
        cy.get('h1').contains('注册');

        cy.loginTestUser();

        cy.contains('Campaigns', { timeout: 10000 }); // dashboard page load
        cy.url().should('include', '/dashboard');
    });
    it('can search for an influencer', () => {
        cy.loginTestUser();
        cy.get('input[type="checkbox').uncheck({ force: true }); // turn off the Recommended Only
        // wait for search results
        cy.contains('T-Series'); // the first influencer search result

        // search for an influencer
        // ensure GRTR is not in the search results
        cy.contains('GRTR').should('not.exist');
        cy.wait(3000);
        cy.getByTestId('creator-search').type('GRTR{enter}');
        // cy.contains will not include the input element in the search, so this shows that the results are in the DOM
        cy.contains('GRTR', { timeout: 30000 });
    });
    it('can search for a topic', () => {
        cy.loginTestUser();
        cy.get('input[type="checkbox').uncheck({ force: true }); // turn off the Recommended Only

        // // wait for search results
        // cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });

        cy.getByTestId('search-spinner').should('exist'); // wait for spinner to appear

        // cy.contains will not include the input element text in the search, so this shows that the result options are in the DOM
        cy.contains('alligators', { timeout: 30000 }).click();

        cy.getByTestId('search-spinner').should('not.exist'); // wait for spinner to disappear

        cy.contains('Brave Wilderness', { timeout: 30000 }); // the first influencer search result for alligators
    });
    it('can open analyze page', () => {
        cy.loginTestUser();
        cy.contains('T-Series', { timeout: 30000 });

        const tSeriesID = 'UCq-Fj5jknLsUf-MWSy4_brA';
        cy.getByTestId(`search-result-row-buttons/${tSeriesID}`).click({
            force: true,
        });

        cy.getByTestId(`analyze-button/${tSeriesID}`)
            .should('have.attr', 'target', '_blank')
            .invoke('removeAttr', 'target') // remove target attribute so we can click it and stay on the same page
            .click({ force: true }); // force click because the button is hidden because of our weird hover UI

        cy.contains('Generating influencer Report. Please wait', { timeout: 30000 }); // loading analyze page
        cy.contains('Contact influencer', { timeout: 30000 }); // loads analyze page

        cy.url().should('include', `influencer/youtube/${tSeriesID}`);

        cy.contains('button', 'Add To Campaign');
        // TODO: test this feature. The problem is we are using a real live account, so we would need to create a campaign and then delete it. currently we don't have a way to delete campaigns. work item: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/245

        cy.contains('Channel Stats'); // not sure what else to look for on this page. Seems good enough for a happy path.
    });
    it('can use account and pricing pages', () => {
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
        cy.contains('button', 'Cancel').click();
        cy.contains('Invite Members').should('not.exist');

        // upgrade subscription links to pricing page
        cy.contains('button', 'Upgrade subscription', { timeout: 10000 }).click(); // loads subscription data
        cy.contains('Choose the best plan for you', { timeout: 10000 }); // loads pricing page
        cy.url().should('include', `/pricing`);
        cy.contains('DIY Max');
        // this doesn't work anymore because we aren't using a live account anymore, so stripe sends back 'can't find subscription' and the button is disabled.
        // TODO: fix this when we implement msw mocks, mock the stripe call/response.
        // cy.contains('button', 'Buy Now', { timeout: 10000 }).click();
        // cy.contains('button', 'Subscribe');
        // cy.contains('button', 'Close').click();
        // cy.contains('button', 'Subscribe').should('not.exist');
    });
    it('can open ai email generator', () => {
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
        // list, add, archive campaigns
        // list, add, move, delete campaign influencers
        cy.loginTestUser();
        cy.contains('Campaigns').click();
        cy.contains('button', 'New Campaign', { timeout: 10000 }); // loads campaigns page
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
        cy.get('button').contains('New Campaign').click();

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

        cy.contains('tr', 'SET India', { timeout: 60000 }).contains('Add to campaign').click();
        cy.contains('Beauty for All Skin Tones');
        cy.get('button[data-testid="add-creator-button:Beauty for All Skin Tones"]').click();
        cy.contains('Campaigns').click({ force: true }); // hidden by modal
        cy.get('button').contains('New Campaign');
        cy.contains('Beauty for All Skin Tones').click();

        // move influencer to new campaign
        cy.contains('tr', 'SET India', { timeout: 60000 }).contains('Move Influencer').click(); // can take a while to refresh
        cy.get('button[data-testid="move-influencer-button:My Campaign"]').click();
        cy.contains('Campaign Launch Date').click({ force: true }); // click out of modal
        cy.contains('SET India').should('not.exist', { timeout: 10000 });
        cy.contains('Campaigns').click();
        cy.contains('My Campaign').click();
        cy.contains('SET India');

        // delete an influencer
        cy.get('button[data-testid="delete-creator"]').click();
        cy.contains('influencer was deleted.');
        cy.contains('SET India').should('not.exist');

        // archive a campaign
        cy.contains('span', 'Archive').click();
        cy.contains('Campaigns').click();
        cy.contains('My Campaign').should('not.exist');
        cy.contains('Archived Campaigns').click();
        cy.contains('My Campaign');
    });
    /** works on local... 🤷‍♂️ */
    it.skip('can log out', () => {
        cy.loginTestUser();
        cy.getByTestId('layout-account-menu').click();
        cy.contains('Log Out').click();
        cy.contains('Log in', { timeout: 30000 }); // loads login page
        cy.url().should('include', `/login`);

        // pre-populates email with original email
        cy.get('input[type="email"]').should('have.value', Cypress.env('TEST_USER_EMAIL_COMPANY_OWNER'));
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
