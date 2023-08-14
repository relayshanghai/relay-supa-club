import useSWR from 'swr';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { createSequenceStepCall } from 'src/utils/api/db/calls/sequence-steps';
import type { SequenceStepInsert } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

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

    const createSequenceStepDBCall = useDB<typeof createSequenceStepCall>(createSequenceStepCall);
    const createDefaultSequenceStep = async (sequenceId: string) => {
        defaultTemplates.map(async (template) => {
            const insert: SequenceStepInsert = {
                name: template.name,
                sequence_id: sequenceId,
                template_id: template.id,
                wait_time_hours: template.waitTimeHours,
                step_number: template.stepNumber,
                params: [],
            };
            try {
                const res = await createSequenceStepDBCall(insert);
                return res;
            } catch (error) {
                serverLogger(error, 'error');
            }
        });
    };

    return {
        sequenceSteps,
        refreshSequenceSteps,
        updateSequenceStep: db.updateSequenceStep,
        createDefaultSequenceStep,
    };
};
