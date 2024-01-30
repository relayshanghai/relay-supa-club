import type { SequenceStepInsert } from 'src/utils/api/db';
import { insertSequenceStepsCall } from 'src/utils/api/db/calls/sequence-steps';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';
import type { SequenceEmailStep } from 'types';

type DefaultTemplateType = {
    name: SequenceEmailStep;
    id: string;
    waitTimeHours: number;
    stepNumber: number;
};
const templateIdOutreach = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_OUTREACH || '';
const templateId1stFollowUp = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_1ST_FOLLOW_UP || '';
const templateId2ndFollowUp = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_2ND_FOLLOW_UP || '';
const templateId3rdFollowUp = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_3RD_FOLLOW_UP || '';

export const defaultTemplates: DefaultTemplateType[] = [
    { name: 'Outreach', id: templateIdOutreach, waitTimeHours: 0, stepNumber: 0 },
    { name: '1st Follow-up', id: templateId1stFollowUp, waitTimeHours: 72, stepNumber: 1 },
    { name: '2nd Follow-up', id: templateId2ndFollowUp, waitTimeHours: 144, stepNumber: 2 },
    { name: '3rd Follow-up', id: templateId3rdFollowUp, waitTimeHours: 216, stepNumber: 3 },
];

export const useSequenceSteps = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceSteps, mutate: refreshSequenceSteps } = useSWR(
        sequenceId ? [sequenceId, 'sequence_steps'] : null,
        () => db.getSequenceStepsBySequenceId(sequenceId ?? ''),
    );

    const createSequenceStepDBCall = useDB<typeof insertSequenceStepsCall>(insertSequenceStepsCall);
    const createDefaultSequenceSteps = async (sequenceId: string) => {
        const insert: SequenceStepInsert[] = defaultTemplates.map(({ name, id, waitTimeHours, stepNumber }) => ({
            name,
            sequence_id: sequenceId,
            template_id: id,
            wait_time_hours: waitTimeHours,
            step_number: stepNumber,
        }));
        await createSequenceStepDBCall(insert);
    };

    return {
        sequenceSteps,
        refreshSequenceSteps,
        updateSequenceStep: db.updateSequenceStep,
        createDefaultSequenceSteps,
    };
};
