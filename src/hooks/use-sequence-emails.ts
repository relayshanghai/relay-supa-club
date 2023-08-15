import useSWR from 'swr';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { getAllSequenceEmailsCall } from 'src/utils/api/db/calls/sequence-emails';
import { useSequences } from './use-sequences';

export const useSequenceEmails = (sequenceId?: string) => {
    const { allSequenceIds } = useSequences();
    const db = useClientDb();

    const { data: sequenceEmails, mutate: refreshSequenceEmails } = useSWR(
        sequenceId ? [sequenceId, 'sequence_email'] : null,
        ([sequenceId]) => db.getSequenceEmailsBySequence(sequenceId),
    );

    if (!allSequenceIds) {
        throw new Error('No sequence ids found');
    }
    const getAllSequenceEmailsDBCall = useDB<typeof getAllSequenceEmailsCall>(getAllSequenceEmailsCall);
    const { data: allSequenceEmails } = useSWR('sequence_email', () => getAllSequenceEmailsDBCall(allSequenceIds));

    return {
        sequenceEmails,
        refreshSequenceEmails,
        updateSequenceEmail: db.updateSequenceEmail,
        allSequenceEmails,
    };
};
