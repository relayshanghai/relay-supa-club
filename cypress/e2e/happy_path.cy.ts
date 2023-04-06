describe('Main pages happy paths', () => {
    it('can log in and load search page and switch language', () => {
        cy.visit('/');
        // starts on signup page. has an h1 that says signup in Chinese: 注册
        cy.get('h1').contains('注册');

        cy.loginTestUser();

        cy.contains('Campaigns', { timeout: 10000 }); // dashboard page load
        cy.url().should('include', '/dashboard');
    });
    it('can search for an influencer', () => {
        cy.loginTestUser();

        // wait for search results
        cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        // search for an influencer
        // ensure GRTR is not in the search results
        cy.contains('GRTR').should('not.exist');

        cy.getByTestId('creator-search').type('GRTR{enter}');
        // cy.contains will not include the input element in the search, so this shows that the results are in the DOM
        cy.contains('GRTR', { timeout: 30000 });
    });
    it('can search for a topic', () => {
        cy.loginTestUser();

        // // wait for search results
        // cy.contains('T-Series', { timeout: 20000 }); // the first influencer search result

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });
        // cy.contains will not include the input element text in the search, so this shows that the result options are in the DOM
        cy.contains('alligators', { timeout: 30000 }).click();

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
        // open one of the modals
        cy.contains('button', 'Add more members').click();
        cy.contains('Invite Members');
        cy.contains('button', 'Cancel').click();
        cy.contains('Invite Members').should('not.exist');

        // upgrade subscription links to pricing page
        cy.contains('button', 'Upgrade subscription').click();
        cy.contains('Choose the best plan for you', { timeout: 10000 }); // loads pricing page
        cy.url().should('include', `/pricing`);
        cy.contains('DIY Max');
        cy.contains('button', 'Buy Now').click();
        cy.contains('button', 'Subscribe');
        cy.contains('button', 'Close').click();
        cy.contains('button', 'Subscribe').should('not.exist');
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
            .should('have.value', 'Test Company')
            .type('123')
            .should('have.value', 'Test Company123');
    });
    it('can open campaigns page', () => {
        cy.loginTestUser();
        cy.contains('Campaigns').click();
        cy.contains('button', 'New Campaign', { timeout: 10000 }); // loads campaigns page
        cy.url().should('include', `/campaigns`);

        // TODO: After we have delete campaign function, test adding and editing/viewing campaigns. work item: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/245
    });
    it('can log out', () => {
        cy.loginTestUser();
        cy.getByTestId('layout-account-menu').click();
        cy.contains('Log Out').click();
        cy.contains('Log In', { timeout: 30000 }); // loads login page
        cy.url().should('include', `/login`);

        // pre-populates email with original email
        cy.get('input[type="email"]').type(Cypress.env('TEST_USER_EMAIL'));
    });
});

// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};
