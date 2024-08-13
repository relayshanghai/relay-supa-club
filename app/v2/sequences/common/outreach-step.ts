import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';
import type { OutreachStatus } from '../types';
import { type StagedSequenceEmailTemplateType } from 'src/store/reducers/sequence-template';

export const getOutreachStepsTranslationKeys = (status: OutreachStatus) => {
    switch (status) {
        case 'OUTREACH':
            return 'Outreach';
        case 'FIRST_FOLLOW_UP':
            return '1st Follow-up';
        case 'SECOND_FOLLOW_UP':
            return '2nd Follow-up';
        case 'THIRD_FOLLOW_UP':
            return '3rd Follow-up';
        default:
            break;
    }
};

export const sortStepsByKeys = (stagedSequenceEmailTemplates: StagedSequenceEmailTemplateType) => {
    const desiredOrder = OUTREACH_STATUSES;
    const sortedStagedSequenceEmailTemplates: any = {};

    desiredOrder.forEach((key) => {
        if (stagedSequenceEmailTemplates.hasOwnProperty(key)) {
            sortedStagedSequenceEmailTemplates[key] = (stagedSequenceEmailTemplates as any)[key];
        }
    });

    return sortedStagedSequenceEmailTemplates as StagedSequenceEmailTemplateType;
};
