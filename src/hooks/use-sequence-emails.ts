import useSWR from 'swr';
import { useDB } from 'src/utils/client-db/use-client-db';
import {
    getAllSequenceEmailsCall,
    getSequenceEmailsBySequenceCall,
    updateSequenceEmailCall,
} from 'src/utils/api/db/calls/sequence-emails';
import { useSequences } from './use-sequences';

export const useSequenceEmails = (sequenceId?: string) => {
    const { allSequenceIds } = useSequences();

    const getSequenceEmailsBySequenceDBCall = useDB<typeof getSequenceEmailsBySequenceCall>(
        getSequenceEmailsBySequenceCall,
    );
    const updateSequenceEmail = useDB<typeof updateSequenceEmailCall>(updateSequenceEmailCall);

    const {
        data: sequenceEmails,
        mutate: refreshSequenceEmails,
        isLoading,
    } = useSWR(sequenceId ? [sequenceId, 'sequence_email'] : null, ([sequenceId]) =>
        getSequenceEmailsBySequenceDBCall(sequenceId),
    );

    const getAllSequenceEmailsDBCall = useDB<typeof getAllSequenceEmailsCall>(getAllSequenceEmailsCall);
    const { data: allSequenceEmails } = useSWR(
        allSequenceIds ? [allSequenceIds, 'sequence_email'] : null,
        ([allSequenceIds]) => getAllSequenceEmailsDBCall(allSequenceIds),
    );

    return {
        sequenceEmails,
        refreshSequenceEmails,
        updateSequenceEmail,
        allSequenceEmails,
        isLoading,
    };
};
