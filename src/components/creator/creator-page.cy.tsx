import React from 'react';
import { CreatorPage } from './creator-page';

import { testMount } from '../../utils/cypress-app-wrapper';

describe('<CreatorPage />', () => {
    before(async () => {
        const { worker } = await import('../../mocks/browser');
        worker.start();
    });

    it('renders', () => {
        testMount(<CreatorPage creator_id="abc-creator" platform="youtube" />);
    });
    it('shows loading state', () => {
        testMount(<CreatorPage creator_id="abc-creator" platform="youtube" />);
        cy.contains('Generating influencer Report. Please wait');
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
