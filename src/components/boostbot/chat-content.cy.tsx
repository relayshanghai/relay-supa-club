import { testMount } from '../../utils/cypress-app-wrapper';
import { ChatContent, type ChatContentProps } from './chat-content';
import type { MessageType } from 'src/components/boostbot/message';

describe('<ChatContent />', () => {
    let handleSelectedInfluencersToUnlock: () => void;
    let handleSelectedInfluencersToOutreach: () => void;
    let stopBoostbot: () => void;
    const messages: MessageType[] = [
        { sender: 'Bot', type: 'text', text: 'test message 1' },
        { sender: 'User', type: 'text', text: 'test message 2' },
    ];
    let props: ChatContentProps;

    beforeEach(() => {
        handleSelectedInfluencersToUnlock = cy.stub();
        handleSelectedInfluencersToOutreach = cy.stub();
        stopBoostbot = cy.stub();

        props = {
            messages,
            isSearchLoading: false,
            shouldShowButtons: true,
            handleSelectedInfluencersToUnlock,
            handleSelectedInfluencersToOutreach,
            stopBoostbot,
            isUnlockOutreachLoading: false,
            areChatActionsDisabled: false,
            isUnlockButtonDisabled: false,
            isOutreachButtonDisabled: false,
        };
    });

    it('Renders the received messages', () => {
        testMount(<ChatContent {...props} />);

        cy.contains('test message 1').should('exist');
        cy.contains('test message 2').should('exist');
    });

    it('Buttons are disabled while loading', () => {
        props.isUnlockOutreachLoading = true;
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-unlock"]').should('be.disabled');
        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Buttons are disabled when chat actions are disabled', () => {
        props.areChatActionsDisabled = true;
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-unlock"]').should('be.disabled');
        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Unlock button gets correctly disabled', () => {
        props.isUnlockButtonDisabled = true;
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-unlock"]').should('be.disabled');
        cy.get('[data-testid="boostbot-button-outreach"]').should('not.be.disabled');
    });

    it('Outreach button gets correctly disabled', () => {
        props.isOutreachButtonDisabled = true;
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-unlock"]').should('not.be.disabled');
        cy.get('[data-testid="boostbot-button-outreach"]').should('be.disabled');
    });

    it('Calls correct actions when buttons are clicked', () => {
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-unlock"]').click();
        cy.wrap(handleSelectedInfluencersToUnlock).should('have.been.called');

        cy.get('[data-testid="boostbot-button-outreach"]').click();
        cy.wrap(handleSelectedInfluencersToOutreach).should('have.been.called');
    });

    it('Calls stop action when stop button is clicked', () => {
        props.isSearchLoading = true;
        props.shouldShowButtons = false;
        testMount(<ChatContent {...props} />);

        cy.get('[data-testid="boostbot-button-stop"]').click();
        cy.wrap(stopBoostbot).should('have.been.called');
    });
});
