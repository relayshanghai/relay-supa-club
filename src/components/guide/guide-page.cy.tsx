/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from 'src/utils/cypress-app-wrapper';
import type { GuideCardKey } from './index';
import { GuideCards, GuideComponent } from './index';
import guidePage from 'i18n/en/guide';
import { worker } from 'src/mocks/browser';

describe('GuideComponent', () => {
    beforeEach(() => {
        worker.start();
    });
    Object.keys(guidePage.modalInfo).forEach((_section) => {
        const section = Object.keys(guidePage.modalInfo).find((key) => key === _section) as GuideCardKey;
        const cardDetails = guidePage.cards[section];

        it('should render', () => {
            testMount(<GuideComponent showVideo={false} />);
            cy.contains(guidePage.welcome + ' BoostBot');
            cy.contains(guidePage.welcomeDescription);
        });
        it('should show section title and description', () => {
            testMount(<GuideComponent showVideo={false} />);

            cy.contains(cardDetails.title);
            cy.contains(cardDetails.description);
        });
    });
});

describe.only('GuideCards', () => {
    beforeEach(() => {
        worker.start();
    });
    Object.keys(guidePage.cards).forEach((_section, i) => {
        if (i > 0) return;
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
            cy.contains(sectionDetails.sections[0].description);
            // contains link to that page
            cy.contains('a', guidePage.goto + ' ' + sectionDetails.title).should(
                'have.attr',
                'href',
                sectionDetails.url,
            );
            cy.contains(guidePage.goBack).should('be.enabled').click();
            cy.contains(guidePage.goto + ' ' + sectionDetails.title).should('not.exist');
        });
    });
});
