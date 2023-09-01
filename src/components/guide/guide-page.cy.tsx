/// <reference types="@testing-library/cypress" />
// @ts-check

import { GuideCards, GuideComponent } from './index';
import guidePage from 'i18n/zh/guide';

describe('GuideComponent', () => {
    Object.keys(guidePage.modalInfo).forEach((section) => {
        const cardDetails = guidePage.cards[section as keyof typeof guidePage.cards];
        beforeEach(() => {
            cy.mount(<GuideComponent />);
        });
        it('should render', () => {
            cy.contains(guidePage.welcome + ' relay.club');
            cy.contains(guidePage.welcomeDescription);
        });
        it('should show section title and description', () => {
            cy.contains(cardDetails.title);
            cy.contains(cardDetails.description);
        });
    });
});

describe('GuideCards', () => {
    Object.keys(guidePage.modalInfo).forEach((section) => {
        const sectionDetails = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
        const cardDetails = guidePage.cards[section as keyof typeof guidePage.cards];
        it('should render', () => {
            cy.mount(<GuideCards cardKey={`${section}`} />);
            cy.contains(cardDetails.title);
            cy.contains(cardDetails.description);
            cy.contains(guidePage.learnMore);
        });
        it('should open modal and close it', () => {
            cy.mount(<GuideCards cardKey={`${section}`} />);
            cy.contains(guidePage.learnMore).click();
            cy.contains(sectionDetails.title);
            cy.contains(guidePage.goBack).click();
            cy.contains(guidePage.goto + ' ' + sectionDetails.title).should('not.exist');
        });
    });
});
