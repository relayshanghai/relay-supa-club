import useSWR from 'swr';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { insertSequenceStepsCall } from 'src/utils/api/db/calls/sequence-steps';
import type { SequenceStepInsert } from 'src/utils/api/db';

export const defaultTemplates = [
    { name: 'Outreach', id: 'AAABiYr-poEAAAAC', waitTimeHours: 0, stepNumber: 0 },
    { name: '1st Follow-up', id: 'AAABiYsMUIAAAAAD', waitTimeHours: 1, stepNumber: 1 },
    { name: '2nd Follow-up', id: 'AAABieM0bMMAAAAE', waitTimeHours: 48, stepNumber: 2 },
    { name: '3rd Follow-up', id: 'AAABieM1AhgAAAAF', waitTimeHours: 72, stepNumber: 3 },
];

export const useSequenceSteps = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceSteps, mutate: refreshSequenceSteps } = useSWR(sequenceId ? 'sequence_steps' : null, () =>
        db.getSequenceStepsBySequenceId(sequenceId ?? ''),
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
