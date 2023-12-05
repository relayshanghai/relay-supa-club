/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from 'src/utils/cypress-app-wrapper';
import type { GuideCardKey } from './index';
import { GuideCards, GuideComponent } from './index';
import guidePage from 'i18n/en/guide';

describe('GuideComponent', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/track*', { status: true });
    });
    Object.keys(guidePage.modalInfo).forEach((_section) => {
        const section = Object.keys(guidePage.modalInfo).find((key) => key === _section) as GuideCardKey;
        const cardDetails = guidePage.cards[section];

        it('should render', () => {
            testMount(<GuideComponent />);
            cy.contains(guidePage.welcome + ' BoostBot');
            cy.contains(guidePage.welcomeDescription);
        });
        it('should show section title and description', () => {
            testMount(<GuideComponent />);

            cy.contains(cardDetails.title);
            cy.contains(cardDetails.description);
        });
    });
});

describe('GuideCards', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/track*', { status: true });
    });
    Object.keys(guidePage.cards).forEach((_section) => {
        const section = Object.keys(guidePage.cards).find((key) => key === _section) as GuideCardKey;
        const sectionDetails = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
        const cardDetails = guidePage.cards[section as keyof typeof guidePage.cards];
        it('should render', () => {
            testMount(<GuideCards cardKey={`${section}`} />);
            cy.contains(cardDetails.title);
            cy.contains(cardDetails.description);
            cy.contains(guidePage.learnMore);
        });
        it('should open modal and close it', () => {
            testMount(<GuideCards cardKey={`${section}` as any} />);
            cy.contains(guidePage.learnMore).click();
            cy.contains(sectionDetails.title);
            cy.contains(guidePage.goBack).click();
            cy.contains(guidePage.goto + ' ' + sectionDetails.title).should('not.exist');
        });
    });
});
