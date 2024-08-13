import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { CampaignModalStepTwo } from './step-2';
import StoreProvider from 'src/store/Providers/StoreProvider';

vi.mock('src/backend/database/sequence-email-template/sequence-email-template-entity', () => ({
    Step: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
    },
}));

vi.mock('pages/api/outreach/email-templates/request', () => ({
    OutreachStepRequest: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
        THIRD_FOLLOW_UP: 'THIRD_FOLLOW_UP',
    },
    TemplateRequest: {
        name: '',
        description: '',
        subject: '',
        template: '',
        step: '',
        variableIds: [],
    },
}));

describe('CampaignModalStepTwo', () => {
    test('component rendered', () => {
        const { getByTestId } = render(
            <StoreProvider>
                <CampaignModalStepTwo onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />
            </StoreProvider>,
        );
        const step1OutreachForm = getByTestId('step2-outreach-form');
        expect(step1OutreachForm).toBeDefined();
    });
});
