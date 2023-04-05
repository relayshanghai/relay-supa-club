import React from 'react';
import { useReport } from './use-report';

import { worker } from '../mocks/browser';
import { testMount } from '../utils/cypress-app-wrapper';

const TestComponent = () => {
    const { report: report } = useReport({ platform: 'youtube', creator_id: 'abc-creator' });
    return <div>{JSON.stringify(report)}</div>;
};

describe('<CreatorPage />', () => {
    before(() => {
        worker.start();
    });

    it('renders', () => {
        testMount(<TestComponent />);
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
