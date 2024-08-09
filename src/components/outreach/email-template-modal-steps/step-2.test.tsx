import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { EmailTemplateModalStepTwo } from './step-2';
import StoreProvider from 'src/store/Providers/StoreProvider';

describe('CampaignModalStepTwo', () => {
    test('component rendered', () => {
        const { getByTestId } = render(
            <StoreProvider>
                <EmailTemplateModalStepTwo onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />
            </StoreProvider>,
        );
        const step1OutreachForm = getByTestId('step2-outreach-form');
        expect(step1OutreachForm).toBeDefined();
    });
});
