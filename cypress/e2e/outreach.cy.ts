import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';
import { columnsIgnored, columnsInSequence, columnsNeedsAttention } from 'src/components/sequences/constants';
import sequences from 'i18n/en/sequences';
import { randomString, reinsertAlice, reinsertCharlie, resetBobsStatus, resetSequenceEmails } from './helpers';
import messageSent from '../../src/mocks/email-engine/webhooks/message-sent.json';
import messageNewReply from '../../src/mocks/email-engine/webhooks/message-new-reply.json';

const setTemplateVariableDescription = (description: string) => {
    cy.contains('tr', 'General collaboration').should('not.exist');
    cy.contains('button', 'View sequence templates').click();
    cy.get('textarea[id="template-variable-input-productDescription"]').clear();
    if (description) {
        cy.get('textarea[id="template-variable-input-productDescription"]').type(description);
    }
    cy.contains('button', 'Update variables').click();
};
const resetData = async () => {
    await deleteDB('app-cache');

    await reinsertAlice();
    await resetBobsStatus();
    await reinsertCharlie(); // reinsert so you can run again easily
    await resetSequenceEmails();
};

describe('outreach', () => {
    beforeEach(() => {
        new Cypress.Promise(resetData);
        // turn back on the real database sequence calls
        setupIntercepts({ useRealSequences: true });

        cy.loginTestUser();
    });
    it('can create new sequences. Can delete sequences', () => {
        cy.contains('CRM').click();
        cy.contains('New sequence', { timeout: 10000 }).click();
        cy.get('input[placeholder="Enter a name for your sequence"]').type('New Sequence Test');
        cy.contains('button', 'Create new sequence').click();
        cy.contains('a', 'New Sequence Test').click({ timeout: 10000 });
        cy.contains('tr', 'View sequence templates').should('not.exist');
        cy.contains('button', 'View sequence templates').click({ timeout: 10000 });
        cy.get('input[id="template-variable-input-productName"]').clear().type('Test Product');
        cy.contains('button', 'Update variables').click();
        cy.contains(
            'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
        ).should('not.exist');
        cy.contains('Template variables updated');
        cy.contains('CRM').click();
        cy.contains('tr', 'New Sequence Test').contains('Test Product');
        //  create another dummy sequence to show multi-delete works
        cy.contains('New sequence').click();
        cy.get('input[placeholder="Enter a name for your sequence"]').type('New Sequence Test 2');
        cy.contains('button', 'Create new sequence').click();
        cy.contains('a', 'New Sequence Test 2');
        // cleanup and test delete
        cy.getByTestId('delete-sequences-button').should('not.be.visible');
        cy.getByTestId('sequences-select-all').should('not.be.checked');
        cy.getByTestId('sequences-select-all').check();
        cy.getByTestId('sequence-checkbox').eq(0).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(1).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(2).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(0).uncheck();
        cy.getByTestId('sequences-select-all').should('not.be.checked');
        cy.getByTestId('delete-sequences-button').click();
        cy.contains('button', 'Yes. Delete this sequence').click();
        cy.contains('tr', 'New Sequence Test').should('not.exist', { timeout: 10000 });
        cy.contains('tr', 'New Sequence Test 2').should('not.exist');
    });
    it.skip('displays sequence page stats and influencers table', () => {
        cy.contains('CRM').click();

        cy.contains('General collaboration', { timeout: 10000 }).click();

        // Sequence title row
        // cy.contains('Auto-start', { timeout: 10000 });  // TODO: reenable when reenabling auto-start https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/974
        cy.contains('button', 'View sequence templates');

        // stats
        cy.getByTestId('stat-card-total influencers').within(() => {
            cy.contains('Total influencers');
            cy.contains('6');
        });
        cy.getByTestId('stat-card-open rate').within(() => {
            cy.contains('Open rate');
            cy.contains('33%');
        });
        cy.getByTestId('stat-card-reply rate').within(() => {
            cy.contains('Reply rate');
            cy.contains('0%');
        });
        cy.getByTestId('stat-card-bounce rate').within(() => {
            cy.contains('Bounce rate');
            cy.contains('17%');
        });

        // tabs
        cy.contains('button', 'Needs attention').within(() => {
            cy.contains('3');
        });
        cy.contains('button', 'In sequence').within(() => {
            cy.contains('2');
        });
        cy.contains('button', 'Ignored').within(() => {
            cy.contains('1');
        });

        cy.get('table tbody tr').should('have.length', 3); // table has three rows
        // has all columns
        columnsNeedsAttention.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'In sequence').click();
        cy.get('table tbody tr').should('have.length', 2);
        columnsInSequence.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'Ignored').click();
        cy.get('table tbody tr').should('have.length', 1);
        columnsIgnored.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'Needs attention').click();
        cy.get('table tbody tr').should('have.length', 3);

        // influencers are in order of Date added, Bob, Alice, then Charlie
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.contains('Bob-Recommended Brown');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.contains('Alice Anderson');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.contains('Charlie Charles');
            });
    });
    it('can delete influencer', () => {
        cy.contains('CRM').click();
        cy.contains('General collaboration', { timeout: 10000 }).click();
        cy.getByTestId('delete-influencers-button').should('not.be.visible');
        cy.getByTestId('sequence-influencers-select-all').should('not.be.checked');
        cy.getByTestId('sequence-influencers-select-all').check();
        cy.contains('Charlie Charles');
        cy.contains('Alice Anderson');
        cy.getByTestId('influencer-checkbox').eq(0).should('be.checked');
        cy.getByTestId('influencer-checkbox').eq(1).should('be.checked');
        cy.getByTestId('influencer-checkbox').eq(2).should('be.checked');
        cy.getByTestId('influencer-checkbox').eq(0).uncheck();
        cy.getByTestId('sequence-influencers-select-all').should('not.be.checked');
        cy.getByTestId('delete-influencers-button').click();
        cy.contains(
            "Deleting the influencer will remove them from the sequence, and cancel any future messages. You'll have to re-add them if you change your mind.",
        );
        cy.contains('button', 'Yes, delete them').click();
        cy.contains('Influencer(s) successfully deleted from sequence', { timeout: 10000 });
        cy.contains('Charlie Charles').should('not.exist');
        cy.contains('Alice Anderson').should('not.exist');
    });
    // https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1009
    it.skip('can edit email', () => {
        cy.contains('CRM').click();
        cy.contains('General collaboration', { timeout: 10000 }).click();
        const newEmail = `new-email-${randomString()}@example.com`;
        cy.contains('Add email').should('not.exist');
        cy.contains('alice.anderson@example.com', { timeout: 10000 });
        cy.contains('tr', 'alice.anderson@example.com').within(() => {
            cy.contains('alice.anderson@example.com').click();
            cy.getByTestId('table-inline-input-add email').clear();
            cy.get('button[type=submit]').click();
            cy.contains('Add email').should('exist').click();
            cy.getByTestId('table-inline-input-add email').type(newEmail);
            cy.get('button[type=submit]').click();
            cy.contains('Add email').should('not.exist');
            cy.contains(newEmail).click();
            cy.getByTestId('table-inline-input-add email').clear().type('alice.anderson@example.com'); // reset so you can run the test again if need be
            cy.get('button[type=submit]').click();
        });
    });
    it('can edit template variables. sending is enabled/disabled based on missing variables', () => {
        cy.contains('CRM').click();
        cy.contains('General collaboration', { timeout: 10000 }).click();
        setTemplateVariableDescription(''); // reset the empty template variable so you can run the test again
        // send sequence is disabled if missing template variables
        cy.contains('Missing required template variables: **Product Description**').should('not.be.visible');
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: **Product Description**');
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseout');
        cy.contains('Missing required template variables: **Product Description**').should('not.be.visible');

        // TODO: reenable when reenabling auto-start https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/974
        // cy.contains('div', 'Auto-start').within(() => {
        //     cy.get('input[type=checkbox]').trigger('mouseover', { force: true });
        // });
        // cy.contains('Missing required template variables: **Product Description**');
        // cy.getByTestId('missing-variables-alert').contains(1);
        // cy.contains('div', 'Auto-start').within(() => {
        // cy.get('input[type=checkbox]').click({ force: true });
        // clicking opens the modal
        // });
        // cy.contains('Template Variables');
        // cy.contains(
        //     'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
        // );
        // TODO: reenable when reenabling auto-start https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/974
        cy.contains('View sequence templates').click(); // and then remove this line
        // can View sequence templates
        cy.get('textarea[id="template-variable-input-productDescription"]').type('test description entry');
        cy.contains('span', 'test description entry');
        cy.contains('button', 'Update variables').click();
        cy.contains('General collaboration').click({ force: true }); // click out of modal

        // can send sequence
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: **Product Description**').should('not.exist');

        // reset the empty template variable so you can run the test again if need be
        setTemplateVariableDescription('');
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: **Product Description**').should('exist');
    });
    it('can send sequence, webhooks update influencer funnel status', () => {
        cy.contains('CRM').click();
        cy.contains('General collaboration', { timeout: 10000 }).click();

        setTemplateVariableDescription('test description entry for webhook test'); // send sequence is disabled if missing template variables
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: **Product Description**').should('not.exist');

        cy.contains('button', 'In sequence').within(() => {
            cy.contains('2'); // before sending bob is in 'to contact' tab
        });

        cy.getByTestId('send-email-button-bob.brown@example.com').click();
        cy.contains('4 email(s) successfully scheduled to send', { timeout: 10000 }); //shows success toast

        setTemplateVariableDescription(''); // reset the empty template variable so you can run the test again

        // Optimistic update: Bob has been moved to 'in sequence' tab
        cy.contains('button', 'In sequence').within(() => {
            cy.contains('3', { timeout: 10000 }); // added Bob, and old ones remain in sequence
        });
        function checkForStatus(status: string, retries = 0) {
            if (retries > 30) {
                throw new Error('Timed out waiting for status to update');
            }
            cy.contains('CRM').click(); // click around to trigger SWR refresh
            cy.contains('New sequence', { timeout: 10000 });
            cy.contains('General collaboration', { timeout: 10000 }).click();
            cy.contains('button', 'In sequence').click();

            cy.contains('tr', 'Bob-Recommended Brown').then(($el) => {
                if ($el.text().includes(status)) {
                    return; // if 'Scheduled' is found, stop the recursion
                } else {
                    cy.wait(1000); // wait for 1 second
                    checkForStatus(status, retries + 1); // call the function again if 'Scheduled' is not found
                }
            });
        }

        checkForStatus('Scheduled');

        // send a message sent webhook request
        cy.request({
            method: 'POST',
            url: '/api/email-engine/webhook',
            body: JSON.parse(JSON.stringify(messageSent)),
            timeout: 10000,
        });
        checkForStatus('Delivered');

        // send a replied webhook request
        cy.request({
            method: 'POST',
            url: '/api/email-engine/webhook',
            body: JSON.parse(JSON.stringify(messageNewReply)),
            timeout: 10000,
        });
        cy.contains('CRM').click(); // click around to trigger SWR refresh
        cy.contains('General collaboration', { timeout: 10000 }).click();
        cy.contains('button', 'In sequence').click();

        // influencer has been moved to the manage influencers page
        // cy.contains('Bob-Recommended Brown').should('not.exist', { timeout: 10000 }); // works on local, but too slow on CIs
        cy.contains('Manager').click();
        cy.contains('tr', 'Bob-Recommended Brown', { timeout: 100000 }).within(() => {
            cy.contains('Negotiating', { timeout: 10000 });
        });
    });
    it('can view templates for sequences', () => {
        cy.contains('CRM').click();
        cy.contains('Widget X', { timeout: 10000 }).click();
        cy.contains('button', 'View sequence templates', { timeout: 10000 }).click();
        cy.contains('Email preview');
        cy.contains('Hey **influencerAccountName**', { timeout: 10000 }); // fills in missing variables
        const outreachMessage =
            'Vivian here from Blue Moonlight Stream Industries. I just saw your "**recentPostTitle**" post, and I gotta say, love your content style 🤩.';
        cy.contains(outreachMessage); // fills in variables
        const firstFollowup = 'Just floating this to the top of your inbox';
        cy.contains(firstFollowup);
        cy.contains('3rd Follow-up'); // shows all emails not just outreach
        const thirdFollowup =
            "One last nudge from me. We'd love to explore the Widget X collab with you. If it's a yes, awesome! If not, no hard feelings.";
        cy.contains(thirdFollowup); // shows all emails not just outreach
        cy.contains('General collaboration').click({ force: true }); // click out of modal
    });
});

describe('non-outreach user', () => {
    beforeEach(() => {
        setupIntercepts();
    });
    it('Shows banner and preview pages when logged in as non outreach user', () => {
        cy.loginAdmin();

        cy.contains('CRM').click();
        cy.contains('Outreach Plan Exclusive Feature');
        cy.contains('Sending sequence emails is only available for Outreach Plan accounts.');
        cy.contains('Manager').click();
        cy.contains('Outreach Plan Exclusive Feature');
        cy.contains('Influencer Manager is only available for Outreach Plan accounts.');
        cy.contains('tr', 'Influencer Name');
        cy.contains('Inbox').click();
        cy.contains('Outreach Plan Exclusive Feature');
        cy.contains('Inbox is only available for Outreach Plan accounts.');
        cy.contains(
            "I've got a Aduro LED Face Mask I'd like to send you, have a feeling it's something your audience would be really into!",
        );
        cy.contains('Upgrade now').click();
        cy.contains('Just getting started, or scaling up.');
    });
    it('does not show on outreach users', () => {
        cy.loginTestUser();
        cy.contains('CRM').click();
        cy.contains('Outreach Plan Exclusive Feature').should('not.exist');
        cy.contains('Manager').click();
        cy.contains('Outreach Plan Exclusive Feature').should('not.exist');
        cy.contains('Inbox').click();
        cy.contains('Outreach Plan Exclusive Feature').should('not.exist');
    });
});
