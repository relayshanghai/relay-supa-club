import { testMount } from '../../utils/cypress-app-wrapper';
import { ChatContent, type ChatContentProps } from './chat-content';
import type { MessageType } from 'src/components/boostbot/message';

describe('<ChatContent />', () => {
    let handleSelectedInfluencersToOutreach: () => void;
    let stopBoostbot: () => void;
    const messages: MessageType[] = [
        { sender: 'Bot', type: 'text', text: 'test message 1' },
        { sender: 'User', type: 'text', text: 'test message 2' },
    ];
    let props: ChatContentProps;

    beforeEach(() => {
        handleSelectedInfluencersToOutreach = cy.stub();
        stopBoostbot = cy.stub();

        props = {
            messages,
            isSearchLoading: false,
            shouldShowButtons: true,
            handleSelectedInfluencersToOutreach,
            stopBoostbot,
            isOutreachLoading: false,
            areChatActionsDisabled: false,
            isOutreachButtonDisabled: false,
        };
    });

    it('Renders the received messages', () => {
        testMount(<ChatContent {...props} />);

        cy.contains('test message 1').should('exist');
        cy.contains('test message 2').should('exist');
    });

    // Temporarily disable the stop button until we design a better flow for the chat actions, related ticket: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1007
    // it('Calls stop action when stop button is clicked', () => {
    //     props.isSearchLoading = true;
    //     props.shouldShowButtons = false;
    //     testMount(<ChatContent {...props} />);

    //     cy.get('[data-testid="boostbot-button-stop"]').click();
    //     cy.wrap(stopBoostbot).should('have.been.called');
    // });
});
