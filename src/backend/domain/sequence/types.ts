import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import type { SequenceStepEntity } from 'src/backend/database/sequence/sequence-step-entity';
import type { TemplateVariableEntity } from 'src/backend/database/template-variable/template-variable-entity';

export type SequenceStepSendV2Payload = {
    emailEngineAccountId: string;
    sequenceInfluencer: SequenceInfluencerEntity;
    sequenceStep: SequenceStepEntity;
    sequenceSteps: SequenceStepEntity[];
    templateVariables: TemplateVariableEntity[];
    reference?: string;
    /** only send the job id for the first step. subsequent step's job id will be added in the handleSent webhook. */
    jobId?: string;
};
