import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';

export function getCurrentSequenceStepInfo(sequenceInfluencer: SequenceInfluencerEntity) {
    if (!sequenceInfluencer.sequenceEmails || sequenceInfluencer.sequenceEmails.length === 0) {
        return {
            sequenceEmailSorted: [],
        };
    }
    const sequenceEmailSorted = sequenceInfluencer.sequenceEmails
        ?.slice()
        .sort((a, b) => a.sequenceStep.stepNumber - b.sequenceStep.stepNumber);
    let currentStep, nextStep;
    for (let i = 0; i < sequenceInfluencer.sequenceEmails.length; i++) {
        const email = sequenceInfluencer.sequenceEmails[i];
        if (email.sequenceStep?.stepNumber === sequenceInfluencer.sequenceStep) {
            currentStep = email;
        }
        if (email.sequenceStep?.stepNumber === sequenceInfluencer.sequenceStep + 1) {
            nextStep = email;
        }
        if (currentStep && nextStep) break;
    }
    return {
        currentStep,
        nextStep,
        sequenceEmailSorted,
    };
}
