import { testMount } from '../../utils/cypress-app-wrapper';
import { Faq } from './faq';

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

const title = 'Your Frequently Asked Questions';

describe('<Faq />', () => {
    it('displays the title and the faqs', () => {
        testMount(<Faq content={faqs} title={title} />);
        cy.contains(title);
        cy.contains(faqs[0].title);
        cy.contains(faqs[1].title);
        // accordion open/close functionality is tested in accordion.cy.tsx
    });
});
