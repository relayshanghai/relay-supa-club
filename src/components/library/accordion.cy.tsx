import { testMount } from '../../utils/cypress-app-wrapper';
import { Accordion } from './accordion';
const faqs = [
    {
        title: "What's the best thing about Switzerland?",
        detail: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        title: "What's the best thing about mars?",
        detail: 'The mountains are a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
    },
];
describe('<Accordion />', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/track*', { status: true });
    });
    it('it will hide details by default, and show details when each title or expand button is clicked', () => {
        testMount(<Accordion content={faqs} type="FAQ" modalName="Example FAQ" />);
        cy.contains(faqs[0].detail).should('not.exist');
        cy.contains(faqs[1].detail).should('not.exist');
        cy.contains(faqs[0].title).click();
        cy.contains(faqs[0].detail).should('exist');
        cy.contains(faqs[1].detail).should('not.exist');
        cy.contains(faqs[1].title).click();
        cy.contains(faqs[0].detail).should('exist');
        cy.contains(faqs[1].detail).should('exist');
    });
});
