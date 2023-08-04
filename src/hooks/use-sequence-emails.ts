import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useSequenceEmails = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceEmails, mutate: refreshSequenceEmails } = useSWR(
        sequenceId ? [sequenceId, 'sequence_email'] : null,
        ([sequenceId]) => db.getSequenceEmailsBySequence(sequenceId),
    );

    return {
        sequenceEmails,
        refreshSequenceEmails,
        updateSequenceEmail: db.updateSequenceEmail,
    };
};
