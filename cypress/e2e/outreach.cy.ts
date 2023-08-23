import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';
import { columnsIgnored, columnsInSequence, columnsNeedsAttention } from 'src/components/sequences/constants';
import sequences from 'i18n/en/sequences';
import { reinsertCharlie, resetSequenceEmails } from './helpers';
import messageSent from '../../src/mocks/email-engine/webhooks/message-sent.json';
import messageNewReply from '../../src/mocks/email-engine/webhooks/message-new-reply.json';

describe('outreach', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        reinsertCharlie(); // reinsert so you can run again easily
        resetSequenceEmails();
        setupIntercepts();
        cy.loginTestUser();
    });
    it('can create new sequence', () => {
        cy.contains('Sequences').click();
        cy.contains('New sequence', { timeout: 10000 }).click();
        cy.get('input[placeholder="Enter a name for your sequence"]').type("New Sequence Test");
        cy.contains('button','Create new sequence').click();
        cy.contains('New Sequence Test').click();
        cy.contains('button', 'Update template variables').click();
        cy.get('input[id="template-variable-input-productName"]').clear().type('Test Product');
        cy.contains('button', 'Update variables').click();
        cy.contains('The values you see here are what will be used to automatically customize the actual email content of your sequence emails!').should('not.exist');
        cy.contains('Template variables updated');
        cy.contains('Sequences').click();
        cy.contains('tr', 'New Sequence Test').contains('Test Product');
        //cleanup
        cy.getByTestId('delete-sequence:New Sequence Test').click();
        cy.contains('tr', 'New Sequence Test').should('not.exist');
    })
    it('sequence page', () => {
        cy.contains('Sequences').click();
        cy.contains('General collaboration', { timeout: 10000 }).click();

        // Sequence title row
        cy.contains('Auto-start', { timeout: 10000 });
        cy.contains('button', 'Update template variables');

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

        // can edit email
        cy.contains('Add email').should('not.exist');
        cy.contains('alice.anderson@example.com').click();
        cy.getByTestId('table-inline-input-add email').clear();
        cy.get('button[type=submit]').click();
        cy.contains('Add email').should('exist').click();
        cy.getByTestId('table-inline-input-add email').type('new-email@example.com');
        cy.get('button[type=submit]').click();
        cy.contains('Add email').should('not.exist');
        cy.contains('new-email@example.com').click();
        cy.getByTestId('table-inline-input-add email').clear().type('alice.anderson@example.com'); // reset so you can run the test again if need be
        cy.get('button[type=submit]').click();

        // can delete influencer
        cy.contains('Charlie Charles');
        cy.getByTestId('delete-influencer-button').eq(2).click();
        cy.contains("Deleting the influencer will remove them from the sequence, and cancel any future messages. You'll have to re-add them if you change your mind.");
        cy.contains('button', 'Yes, delete them').click();
        cy.contains('Influencer successfully deleted from sequence')
        cy.contains('Charlie Charles').should('not.exist');

        // send sequence is disabled if missing template variables
        cy.contains('Missing required template variables: Product Description').should('not.be.visible');
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: Product Description');
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseout');
        cy.contains('Missing required template variables: Product Description').should('not.be.visible');
        cy.contains('div', 'Auto-start').within(() => {
            cy.get('input[type=checkbox]').trigger('mouseover', { force: true });
        });
        cy.contains('Missing required template variables: Product Description');
        cy.contains('div', 'Auto-start').within(() => {
            cy.get('input[type=checkbox]').click({ force: true });
            // clicking opens the modal
        });
        cy.contains('Template Variables');
        cy.contains(
            'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
        );
        // can update template variables
        cy.get('input[id="template-variable-input-productDescription"]').type('test description entry');
        cy.contains('button', 'Update variables').click();
        cy.contains('General collaboration').click({ force: true }); // click out of modal

        // can send sequence
        cy.getByTestId('send-email-button-bob.brown@example.com').trigger('mouseover');
        cy.contains('Missing required template variables: Product Description').should('not.exist');

        // can view all emails preview
        cy.getByTestId('show-all-email-previews-button').eq(0).click();
        cy.getByTestId('email-preview-modal-spinner');
        cy.contains('Hey **influencerAccountName**', { timeout: 10000 }); // fills in missing variables
        cy.contains(
            'Vivian here from Blue Moonlight Stream Industries. I watched your "**recentVideoTitle**" video, and love your content style!!',
        ); // fills in variables
        cy.contains('3rd Follow-up'); // shows all emails not just outreach
        cy.contains('Hope you had a chance to think about our Widget X collab. Still think we’d make a great team!'); // shows all emails not just outreach
        cy.contains('General collaboration').click({ force: true }); // click out of modal

        // can view next email preview.
        cy.contains('button', 'In sequence').click();
        cy.contains('button', '1st Follow-up').click();
        cy.getByTestId('email-preview-modal-spinner');
        cy.contains('Hope you had a chance to think about our Widget X collab. Still think we’d make a great team!', {
            timeout: 10000,
        });
        cy.contains(
            'Vivian here from Blue Moonlight Stream Industries. I watched your "**recentVideoTitle**" video, and love your content style!!',
        ).should('not.exist'); //only shows the selected one
        cy.contains('button', 'Needs attention').click({ force: true });

        // WEBHOOKS TEST
        // send the sequence, then manually send the webhooks to the next app and check the influencers status changes

        cy.getByTestId('send-email-button-bob.brown@example.com').click();

        cy.contains('4 emails successfully scheduled to send', { timeout: 10000 }); //shows success toast

        // reset the empty template variable so you can run the test again if need be
        cy.contains('button', 'Update template variables').click();
        cy.get('input[id="template-variable-input-productDescription"]').clear();
        cy.contains('button', 'Update variables').click();
        cy.contains('General collaboration').click({ force: true }); // click out of modal

        cy.reload(); // todo: remove when we can get status updates relfecting more quickly
        // bob has been moved to 'in sequence' tab
        cy.contains('Bob-Recommended Brown').should('not.exist', { timeout: 10000 });
        cy.contains('button', 'In sequence').click();
        cy.contains('tr', 'Bob-Recommended Brown').within(() => {
            cy.contains('Scheduled');
        });

        // send a message sent webhook request
        cy.request({
            method: 'POST',
            url: '/api/email-engine/webhook',
            body: JSON.parse(JSON.stringify(messageSent)),
        });
        cy.reload(); // todo: remove this when we get push updates
        cy.contains('button', 'In sequence').click();

        cy.contains('tr', 'Bob-Recommended Brown').within(() => {
            cy.contains('Delivered', { timeout: 10000 });
        });

        // send a replied webhook request
        cy.request({
            method: 'POST',
            url: '/api/email-engine/webhook',
            body: JSON.parse(JSON.stringify(messageNewReply)),
        });
        cy.reload(); // todo: remove this when we get push updates
        cy.contains('button', 'In sequence').click();
        // influencer has been moved to the manage influencers page
        cy.contains('Bob-Recommended Brown').should('not.exist');
        cy.contains('Influencer Manager').click();
        cy.contains('Bob-Recommended Brown');
    });
});
