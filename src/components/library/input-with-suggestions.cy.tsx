import { testMount } from '../../utils/cypress-app-wrapper';
import { InputWithSuggestions } from './input-with-suggestions';

describe('<InputWithSuggestions  />', () => {
    let onSelect: (value: string) => void;
    const suggestions = [
        { value: 'suggestion1', label: 'Suggestion 1' },
        { value: 'suggestion2', label: 'Suggestion 2' },
        { value: 'suggestion3', label: 'Suggestion 3' },
    ];

    beforeEach(() => {
        onSelect = cy.stub();
    });

    it('should show suggestions on focus', () => {
        testMount(<InputWithSuggestions onSelect={onSelect} suggestions={suggestions} disabled={true} />);

        cy.get('input').focus();

        cy.get('ul').should('be.visible');
    });

    it('should filter suggestions based on the input', () => {
        testMount(<InputWithSuggestions onSelect={onSelect} suggestions={suggestions} disabled={true} />);

        cy.get('input').focus();

        cy.get('li').should('have.length', 3);

        cy.get('input').type('1');

        cy.get('li').should('have.length', 1);
        cy.get('li').contains('Suggestion 1');
    });

    it('should hide suggestions on outside click', () => {
        testMount(<InputWithSuggestions onSelect={onSelect} suggestions={suggestions} disabled={true} />);

        cy.get('input').focus();

        cy.get('ul').should('be.visible');

        cy.get('body').click(500, 500);

        cy.get('ul').should('not.exist');
    });

    it('should call onSelect with the value of the selected suggestion', () => {
        testMount(<InputWithSuggestions onSelect={onSelect} suggestions={suggestions} disabled={true} />);

        cy.get('input').focus();
        cy.contains('Suggestion 1').click();

        cy.get('input').should('have.value', '');
        cy.wrap(onSelect).should('have.been.calledWith', 'suggestion1');
    });

    it('should clear input when a suggestion is selected', () => {
        testMount(<InputWithSuggestions onSelect={onSelect} suggestions={suggestions} disabled={true} />);

        cy.get('input').focus().type('1');
        cy.contains('Suggestion 1').click();

        cy.get('input').should('have.value', '');
    });
});
