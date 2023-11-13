import type { Dispatch, SetStateAction } from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { ChatInput } from './chat-input';

describe('<ChatInput />', () => {
    let onSendMessage: (message: string) => void;
    let setSelectedInfluencers: Dispatch<SetStateAction<Record<string, boolean>>>;
    beforeEach(() => {
        onSendMessage = cy.stub();
        setSelectedInfluencers = cy.stub();
    });

    it('Enables button when isLoading and isDisabled are false', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={false}
            />,
        );

        cy.getByTestId('boostbot-send-message').should('not.be.disabled');
    });

    it('Disables textarea, button and send action when isLoading is true', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={true}
                isDisabled={false}
            />,
        );

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('not.have.been.called');
        cy.getByTestId('boostbot-send-message').should('be.disabled');
    });

    it('Disables textarea and button when isDisabled is true', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={true}
            />,
        );

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('not.have.been.called');
        cy.getByTestId('boostbot-send-message').should('be.disabled');
    });

    it('Handles text input and sends message correctly when clicking button', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={false}
            />,
        );

        cy.get('textarea').type('Hello, World!').should('have.value', 'Hello, World!');

        cy.getByTestId('boostbot-send-message').click();

        cy.wrap(onSendMessage).should('have.been.calledWith', 'Hello, World!');
    });

    it('Handles text input and sends message correctly when pressing enter', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={false}
            />,
        );

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('have.been.calledWith', 'Hello, World!');
    });

    it('Clears textarea after sending message', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={false}
            />,
        );

        cy.get('textarea').type('Hello, World!{enter}');

        cy.get('textarea').should('have.value', '');
    });

    it('Opens the options modal when the options button is clicked', () => {
        testMount(
            <ChatInput
                setSelectedInfluencers={setSelectedInfluencers}
                onSendMessage={onSendMessage}
                isLoading={false}
                isDisabled={false}
            />,
        );

        cy.getByTestId('boostbot-open-options').click();
        cy.contains('Filter influencers');
        cy.contains('Clear chat and filters');
    });
});
