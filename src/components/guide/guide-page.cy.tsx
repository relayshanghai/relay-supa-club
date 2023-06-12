/// <reference types="@testing-library/cypress" />
// @ts-check

import { GuideComponent } from './index';
import guidePage from 'i18n/en/guide';

describe('GuideComponent', () => {
    beforeEach(() => {
        cy.mount(<GuideComponent />);
    });
    it('should render', () => {
        cy.contains('Welcome to relay.club');
        cy.contains(guidePage.welcomeDescription);
    });
    it('should have Discover Section', () => {
        cy.contains(guidePage.cards.discover.title);
        cy.contains(guidePage.cards.discover.description);
    });
    it('should have Campaigns Section', () => {
        cy.contains(guidePage.cards.campaigns.title);
        cy.contains(guidePage.cards.campaigns.description);
    });
    it('should have Performance Section', () => {
        cy.contains(guidePage.cards.performance.title);
        cy.contains(guidePage.cards.performance.description);
    });
    it('should have My Account Section', () => {
        cy.contains(guidePage.cards.account.title);
        cy.contains(guidePage.cards.account.description);
    });
    it('should have AI Email Section', () => {
        cy.contains(guidePage.cards.aiEmailGenerator.title);
        cy.contains(guidePage.cards.aiEmailGenerator.description);
    });
});
