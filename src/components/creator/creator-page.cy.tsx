import React from 'react';
import { CreatorPage } from './creator-page';

import { testMount } from 'src/utils/cypress-app-wrapper';

describe('<CreatorPage />', () => {
    it('renders', () => {
        testMount(<CreatorPage creator_id="abc-creator" platform="youtube" />);
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
