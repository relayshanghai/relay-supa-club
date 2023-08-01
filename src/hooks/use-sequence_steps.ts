import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useSequenceSteps = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceSteps, mutate: refreshSequenceSteps } = useSWR(sequenceId ? 'sequence_steps' : null, () =>
        db.getSequenceStepsBySequenceId(sequenceId ?? ''),
    );

    return {
        sequenceSteps,
        refreshSequenceSteps,
        updateSequenceStep: db.updateSequenceStep,
    };
};
