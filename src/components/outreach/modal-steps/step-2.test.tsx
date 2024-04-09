import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { CampaignModalStepTwo } from './step-2';

describe('CampaignModalStepTwo', () => {
    test('component rendered', () => {
        const { getByTestId } = render(
            <CampaignModalStepTwo onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />,
        );
        const step1OutreachForm = getByTestId('step2-outreach-form');
        expect(step1OutreachForm).toBeDefined();
    });
});
