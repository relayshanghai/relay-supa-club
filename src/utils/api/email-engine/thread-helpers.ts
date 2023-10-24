import { v4 as uuid } from 'uuid';
import type { SequenceStep } from '../db/types';

export const generateMessageId = (email: string) => {
    // message id format is "<UUID@senderdomain.com>" (including the <> symbols)
    return `<${uuid()}@${email.split('@')[1]}>`;
};
export const gatherMessageIds = (email: string, sequenceSteps: SequenceStep[]) => {
    return Object.fromEntries(sequenceSteps.map((step) => [step.step_number, generateMessageId(email)]));
};
export const generateReferences = (
    messageIds: {
        [k: string]: string;
    },
    stepNumber: number,
) => {
    return Object.values(messageIds).slice(0, stepNumber).join(' ');
};
