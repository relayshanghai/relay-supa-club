import { OutreachStatus } from '../types';

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
