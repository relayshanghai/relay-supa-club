import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { CampaignModalStepOne } from './step-1';
import StoreProvider from 'src/store/Providers/StoreProvider';
import { Step } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';

vi.mock('src/backend/database/sequence-email-template/sequence-email-template-entity', () => ({
    Step: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
    },
}));

vi.mock('src/store/reducers/sequence-template', async () => {
    const actual = (await vi.importActual('src/store/reducers/sequence-template')) as any;
    return {
        ...actual,
        useSequenceEmailTemplateStore: () => ({
            setStagedSequenceEmailTemplate: vi.fn(),
            resetStagedSequenceEmailTemplate: vi.fn(),
            stagedSequenceEmailTemplates: {
                [Step.OUTREACH]: {
                    id: '1',
                    name: 'Template 1',
                    description: 'Template 1',
                },
                [Step.FIRST_FOLLOW_UP]: {
                    id: '2',
                    name: 'Template 2',
                    description: 'Template 2',
                },
                [Step.SECOND_FOLLOW_UP]: {
                    id: '3',
                    name: 'Template 3',
                    description: 'Template 3',
                },
            },
        }),
    };
});
vi.mock('src/hooks/v2/use-sequences-template', () => ({
    useSequenceEmailTemplates: () => ({
        sequenceEmailTemplates: [],
        refreshSequenceEmailTemplates: vi.fn(),
    }),
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

describe('CampaignModalStepOne', () => {
    test('component rendered', () => {
        const { getByTestId } = render(
            <StoreProvider>
                <CampaignModalStepOne onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />
            </StoreProvider>,
        );
        const step1OutreachForm = getByTestId('step1-outreach-form');
        expect(step1OutreachForm).toBeDefined();
    });

    test('staged data rendered', () => {
        const { getAllByTestId } = render(
            <StoreProvider>
                <CampaignModalStepOne onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />
            </StoreProvider>,
        );
        const data1 = getAllByTestId('test-id-1');
        const data2 = getAllByTestId('test-id-2');
        const data3 = getAllByTestId('test-id-3');
        expect(data1[0]).toBeDefined();
        expect(data2[0]).toBeDefined();
        expect(data3[0]).toBeDefined();
    });
});
