import { testMount } from '../../utils/cypress-app-wrapper';
import { ChatInput } from './chat-input';

describe('<ChatInput />', () => {
    let onSendMessage: (message: string) => void;

    beforeEach(() => {
        onSendMessage = cy.stub();
    });

    it('Disables textarea and send action when isLoading is true', () => {
        testMount(<ChatInput onSendMessage={onSendMessage} isLoading={true} isDisabled={false} />);

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('not.have.been.called');
        cy.get('button').should('be.disabled');
    });

    it('Disables textarea and button when isDisabled is true', () => {
        testMount(<ChatInput onSendMessage={onSendMessage} isLoading={false} isDisabled={true} />);

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('not.have.been.called');
        cy.get('button').should('be.disabled');
    });

    it('Handles text input and sends message correctly when clicking button', () => {
        testMount(<ChatInput onSendMessage={onSendMessage} isLoading={false} isDisabled={false} />);

        cy.get('textarea').type('Hello, World!').should('have.value', 'Hello, World!');

        cy.get('button').click();

        cy.wrap(onSendMessage).should('have.been.calledWith', 'Hello, World!');
    });

    it('Handles text input and sends message correctly when pressing enter', () => {
        testMount(<ChatInput onSendMessage={onSendMessage} isLoading={false} isDisabled={false} />);

        cy.get('textarea').type('Hello, World!{enter}');

        cy.wrap(onSendMessage).should('have.been.calledWith', 'Hello, World!');
    });

    it('Clears textarea after sending message', () => {
        testMount(<ChatInput onSendMessage={onSendMessage} isLoading={false} isDisabled={false} />);

        cy.get('textarea').type('Hello, World!{enter}');

        cy.get('textarea').should('have.value', '');
    });
});
