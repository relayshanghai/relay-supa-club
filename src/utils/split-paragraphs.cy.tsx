import { testMount } from './cypress-app-wrapper';
import { SplitParagraphs } from './split-paragraphs';

describe('<SplitParagraphs />', () => {
    it('splits text into p tags if it includes a \n', () => {
        const text = 'This is a test\nLine 2\nLine 3';
        testMount(<SplitParagraphs text={text} />);
        cy.get('p').should('have.length', 3);
        cy.get('p').eq(0).should('have.text', 'This is a test');
        cy.get('p').eq(1).should('have.text', 'Line 2');
        cy.get('p').eq(2).should('have.text', 'Line 3');
    });
});
