import { deleteDB } from 'idb';
import { addPostIntercept, cocomelonId, setupIntercepts } from './intercepts';
import { featEmail } from 'src/constants/feature-flags';

export const randomString = (length = 8) =>
    Math.random()
        .toString(36)
        .substring(2, length + 2);

describe('Main pages happy paths', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    });
    it('Landing page works, has both languages, and links to signup', () => {
        cy.visit('/');
        cy.contains('relay.club可以帮助');
        cy.switchToEnglish();
        cy.reload();
        cy.contains('relay.club可以帮助').should('not.exist');
        cy.contains('relay.club can help.');
        cy.contains('Already signed up?Log in');
        cy.contains('button', 'Start Your Free Trial').click();
        cy.url().should('include', '/signup');
    });
    it('Can sign up new users using signup wizard', () => {
        const randomEmail = `test${randomString()}@example.com`;

        cy.switchToEnglish();
        cy.visit('/signup');
        cy.contains('Verify your number to get started');

        // Carousel
        cy.contains('Discover');
        cy.contains('Project Management').should('not.exist');
        cy.contains('Find the perfect influencer without all the hassle');

        cy.contains('label', 'First Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Jane').type('Joe');
        });
        cy.contains('label', 'Last Name').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Doe').type('Smith');
        });
        cy.contains('label', 'Phone Number').within(() => {
            cy.get('input').should('have.attr', 'placeholder', '+1 (000) 000-0000').type('1234567890');
        });
        cy.contains('button', 'Next').click();

        cy.contains('Add an email and password to your account');
        cy.contains('label', 'Email').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'you@site.com').type(randomEmail);
        });
        cy.contains('label', 'Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Enter your password').type('test1234');
            cy.contains('Must be at least 10 characters long');
            cy.get('input').clear().type('test12345678!');
        });
        cy.contains('label', 'Confirm Password').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Confirm your password').type('test12345678!');
        });
        cy.contains('button', 'Next').click();

        cy.contains('What category of product do you sell?');
        cy.get('input').click();
        cy.contains('AR/VR/XR').click();
        cy.contains('button', 'Next').click();

        cy.contains('Tell us about your Company');
        cy.contains('label', 'Company').within(() => {
            cy.get('input')
                .should('have.attr', 'placeholder', 'Enter your company name')
                .type(`Test Company ${randomString()}`);
        });
        cy.contains('label', 'Website').within(() => {
            cy.get('input').should('have.attr', 'placeholder', 'www.site.com').type('https://test.com');
        });

        cy.contains('Size');
        cy.contains('11-50').click();
        cy.contains('button', 'Next').click();

        cy.contains('We won’t charge your card until the free trial ends!');

        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.contains('Country', { timeout: 10000 });
            cy.get('input[autocomplete="billing cc-number"]').type('4242424242424242');
            cy.get('input[autocomplete="billing cc-exp"]').type('1227');
            cy.get('input[autocomplete="billing cc-csc"]').type('123');
            // Some countries like India won't show an input for Postal Code
            cy.get('form').then(($form) => {
                if ($form.find('input[autocomplete="billing postal-code"]').length > 0)
                    cy.get('input[autocomplete="billing postal-code"]').type('12345');
            });
        });
        cy.contains('Success').should('not.exist');
        cy.contains('button', 'Start Free Trial').click();
        cy.contains('Success', { timeout: 30000 });
        // redirects to dashboard on success
        cy.url().should('include', '/dashboard', { timeout: 30000 });
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

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.getByTestId('search-spinner').should('exist'); // wait for spinner to appear
        });

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
        cy.contains('My Account').click();
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
        cy.contains('button', /Cancel/).click({ force: true });
        cy.contains('Invite Members').should('not.exist');

        // upgrade subscription links to pricing page
        cy.contains('button', 'Upgrade subscription').click(); // loads subscription data
        cy.contains('Just getting started, or scaling up.', { timeout: 10000 }); // loads pricing page
        cy.url().should('include', `/pricing`);
        cy.contains('DIY');
        cy.contains('DIY Max');

        // this doesn't work anymore because we aren't using a live account anymore, so stripe sends back 'can't find subscription' and the button is disabled.
        cy.contains('button', 'Buy Now').click();
        cy.contains('button', 'Subscribe');
        cy.contains('button', 'Close').click();
        cy.contains('button', 'Subscribe').should('not.exist');
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

    if (featEmail() === false) {
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
            cy.get('button').contains('Create Campaign').click();
            cy.wait(10000); // wait for campaign to be added to db

            cy.contains('Campaign Launch Date', { timeout: 10000 });
            cy.contains('SET India').should('not.exist');

            cy.contains('Campaigns').click();

            // campaigns are listed in order of most recently added/edited.
            cy.wait(5000); // wait for campaign to be added to db
            cy.getByTestId('campaign-cards-container').children().should('have.length', 2);
            cy.getByTestId('campaign-cards-container', { timeout: 60000 }).children().first().contains('My Campaign');
            cy.getByTestId('campaign-cards-container').children().first().next().contains('Beauty for All Skin Tones');

            cy.contains('My Campaign').click();

            // go to search and add an influencer to campaign
            cy.contains('Add New Influencer').click();

            cy.contains('tr', 'SET India', { timeout: 30000 }).contains('Add to campaign').click(); // not sure why this is still slow
            cy.contains('Beauty for All Skin Tones');
            cy.getByTestId('add-creator-button:Beauty for All Skin Tones').click();
            cy.contains('Influencer added successfully.', { timeout: 60000 });
            cy.contains('Followers').click({ force: true }); // click out of modal
            cy.contains('tr', 'PewDiePie').contains('Add to campaign').click();
            cy.contains('Beauty for All Skin Tones');
            cy.getByTestId('add-creator-button:Beauty for All Skin Tones').click();

            cy.contains('Campaigns').click({ force: true }); // hidden by modal
            cy.contains('Influencer added successfully.', { timeout: 60000 });
            cy.get('button').contains('New Campaign');

            cy.contains('Beauty for All Skin Tones').click();

            // edit a campaign
            cy.contains('Edit', { timeout: 60000 }).click();
            cy.get('textarea[name=description]').type('This campaign is about selling some stuff');
            cy.get('input[name=product_name]').type('Gadget');
            cy.get('input[aria-haspopup="true"]').first().click();
            cy.contains('Books').click();
            cy.get('input[aria-haspopup="true"]').eq(1).click();
            cy.contains('Albania').click();
            cy.get('input[name=budget_cents]').type('1000');
            cy.get('input[name=promo_types]').check({ force: true });
            cy.contains('button', 'Save Campaign').click();

            cy.contains('tr', 'PewDiePie', { timeout: 60000 });
            cy.contains('tr', 'SET India', { timeout: 60000 });
            cy.contains('tr', '@Greg Renko');

            cy.contains('Campaigns').click(); // We're sure new influencers have been added, now go back and check order of campaigns

            // Beauty for All Skin Tones should now be listed first, since we added an influencer to it
            cy.getByTestId('campaign-cards-container').children().first().contains('Beauty for All Skin Tones');
            cy.getByTestId('campaign-cards-container').children().first().next().contains('My Campaign');
            cy.contains('Beauty for All Skin Tones').click();

            // influencers should be presented in order of last added/edited
            cy.get('tr').eq(1).contains('PewDiePie'); //starts at 1 cause table head is a tr as well
            cy.get('tr').eq(2).contains('SET India');
            cy.get('tr').eq(3).contains('@Greg Renko');

            cy.contains('tr', 'SET India').within(() => {
                cy.getByTestId('manage-button').click();
            });
            cy.contains('Manage Influencer');
            cy.get('input[id="influencer-address-input"]').type('123 Main St');
            cy.contains('button', 'Save').click();
            cy.contains('Beauty for All Skin Tones').click({ force: true }); // click out of modal

            cy.get('tr').eq(1).contains('SET India');
            cy.get('tr').eq(2).contains('PewDiePie');
            cy.get('tr').eq(3).contains('@Greg Renko');

            // move influencer to new campaign
            cy.contains('tr', 'SET India').within(() => cy.getByTestId('move-influencer-button').click()); // can take

            cy.getByTestId('move-influencer-button:My Campaign').click({ multiple: true });
            cy.contains('Campaign Launch Date').click({ force: true }); // click out of modal
            cy.contains('SET India').should('not.exist');
            cy.contains('Campaigns').click();
            cy.contains('My Campaign').click();
            cy.contains('SET India');

            // change influencer status, and change status tabs
            cy.contains('tr', 'SET India').within(() =>
                cy.getByTestId('status-dropdown').select('Contacted', { force: true }),
            );
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
    }

    it('can record search usages, can manage clients as a company owner', () => {
        setupIntercepts();
        cy.loginAdmin();

        cy.contains('My Account').click();
        cy.contains('Usage limits', { timeout: 30000 });
        cy.contains('https://relay.club', { timeout: 20000 });
        cy.contains('https://blue-moonlight-stream.com').should('not.exist');
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '0');
        });

        cy.contains('Discover').click();
        cy.contains('button', 'Search');

        // rack up 2 searches
        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
        });
        cy.contains('alligators').click();
        cy.getByTestId('search-spinner').should('not.exist');
        cy.contains('button', 'Search').click();

        cy.getByTestId('search-topics').within(() => {
            cy.get('input').type('monkeys');
        });
        cy.contains('monkeys').click();
        cy.getByTestId('search-spinner').should('not.exist');
        cy.contains('button', 'Search').click();

        cy.contains('My Account').click();
        cy.contains('Usage limits', { timeout: 30000 });
        cy.contains('https://relay.club');

        // searches should have increased by 2
        cy.contains('td', '2', { timeout: 30000 }); // wait for count to update
        cy.contains('tr', 'Searches').within(() => {
            cy.contains('td', '2');
        });

        cy.contains('Campaigns').click();
        cy.contains('The Future of Gaming is Here'); // the relay company campaign
        cy.contains('Beauty for All Skin Tones').should('not.exist'); // the user's company campaign

        cy.contains('Clients').click();

        // check warning message
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises').should('not.exist');
        cy.contains('tr', 'Blue Moonlight Stream Enterprises', { timeout: 20000 }).within(() => {
            cy.contains('Manage').click();
        });
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises');

        // can see client's campaigns
        cy.contains('Campaigns').click();
        cy.contains('button', 'New Campaign');
        cy.contains('Beauty for All Skin Tones', { timeout: 30000 }); // wait for campaigns to load
        cy.contains('The Future of Gaming is Here').should('not.exist');
        cy.contains('You are acting on behalf of company: Blue Moonlight Stream Enterprises'); // check that warning persists

        // can see client's search totals
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
        cy.getByTestId('search-spinner').should('not.exist');
        cy.contains('button', 'Search').click();

        // Check that search total increased
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

        cy.contains('My Account').click();
        cy.contains('https://blue-moonlight-stream.com').should('not.exist');
        cy.contains('https://relay.club');
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
        cy.contains('tr', 'Greg Renko').within(() =>
            cy.getByTestId('status-dropdown').select('Posted', { force: true }),
        );

        cy.contains('Posted 1').click();
        cy.contains('Content').click();
        cy.contains('h2', 'Manage Posts');

        const youtubeLink = 'https://www.youtube.com/watch?v=UzL-0vZ5-wk';
        cy.contains('form', 'Add Post URL').within(() => {
            cy.get('input').type(youtubeLink);
            cy.get('button').contains('Submit').should('not.be.disabled').click();
        });

        cy.contains('Successfully added 1 URLs');
        cy.contains('tr', 'Greg Renko').within(() =>
            cy.getByTestId('status-dropdown').select('To Contact', { force: true }),
        );

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
