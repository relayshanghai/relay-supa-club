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

export const defaultTemplates: DefaultTemplateType[] = [
    { name: 'Outreach', id: 'AAABjI-pQaoAAAAC', waitTimeHours: 0, stepNumber: 0 },
    { name: '1st Follow-up', id: 'AAABjI-qXSUAAAAD', waitTimeHours: 72, stepNumber: 1 },
    { name: '2nd Follow-up', id: 'AAABjI-sOk8AAAAE', waitTimeHours: 144, stepNumber: 2 },
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
