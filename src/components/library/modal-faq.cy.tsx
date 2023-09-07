import { useState } from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { FaqModal } from './modal-faq';

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
        testMount(<FaqModal visible={true} onClose={() => null} content={faqs} title={title} />);
        cy.contains(title);
        cy.contains(faqs[0].title);
        cy.contains(faqs[1].title);
        // accordion open/close functionality is tested in accordion.cy.tsx
    });
    it('close/back buttons work. Get more info button gets called and closes modal', () => {
        const buttonAction = cy.stub();
        const Component = () => {
            const [open, setOpen] = useState(true);
            return (
                <FaqModal
                    visible={open}
                    onClose={() => setOpen(false)}
                    content={faqs}
                    title={title}
                    getMoreInfoButtonText="Get More Info"
                    getMoreInfoButtonAction={buttonAction}
                />
            );
        };
        testMount(<Component />);
        cy.contains(title);
        cy.contains('Get More Info').click();
        cy.wrap(buttonAction).should('be.calledOnce');
        cy.contains(title).should('not.exist');

        testMount(<Component />);
        cy.contains(title);
        cy.contains('Back').click();
        cy.contains(title).should('not.exist');

        testMount(<Component />);
        cy.contains(title);
        cy.getByTestId('faq-modal-close-button').click();
        cy.contains(title).should('not.exist');
    });
});
