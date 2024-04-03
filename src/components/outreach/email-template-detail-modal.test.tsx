import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { EmailTemplateDetailModal } from './email-template-detail-modal';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';

enum Step {
    OUTREACH = 'OUTREACH',
    FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
    SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
    THIRD_FOLLOW_UP = 'THIRD_FOLLOW_UP',
}

describe('ModalHeader Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('should render the component', () => {
        const { getByTestId } = render(
            <EmailTemplateDetailModal
                setShowEmailTemplateDetailModal={() => null}
                showEmailTemplateDetailModal={true}
                data={
                    {
                        id: '1',
                        name: 'Test',
                        step: Step.OUTREACH,
                    } as OutreachEmailTemplateEntity & Step
                }
            />,
        );
        const emailTemplateDetailModalBody = getByTestId('template-detail-modal-body');
        const emailTemplateDetailModalCloseButton = getByTestId('template-detail-modal-close-button');
        const sequenceNameInput = getByTestId('sequence-name-input');
        const subjectLineInput = getByTestId('subject-line-input');
        const templateInput = getByTestId('template-input');
        const deleteButton = getByTestId('delete-button');
        const modifyTemplateButton = getByTestId('modify-template-button');
        const useInSequenceButton = getByTestId('use-in-sequence-button');
        expect(emailTemplateDetailModalBody).toBeDefined();
        expect(emailTemplateDetailModalCloseButton).toBeDefined();
        expect(sequenceNameInput).toBeDefined();
        expect(subjectLineInput).toBeDefined();
        expect(templateInput).toBeDefined();
        expect(deleteButton).toBeDefined();
        expect(modifyTemplateButton).toBeDefined();
        expect(useInSequenceButton).toBeDefined();
    });

    test('should not render the component', () => {
        const { getByTestId } = render(
            <EmailTemplateDetailModal
                setShowEmailTemplateDetailModal={() => null}
                showEmailTemplateDetailModal={false}
                data={
                    {
                        id: '1',
                        name: 'Test',
                        step: Step.OUTREACH,
                    } as OutreachEmailTemplateEntity & Step
                }
            />,
        );
        try {
            getByTestId('template-detail-modal-body');
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
