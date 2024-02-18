import useSWR from 'swr';
import { useDB } from 'src/utils/client-db/use-client-db';
import { getAllSequenceEmailsCall, getSequenceEmailsBySequenceCall } from 'src/utils/api/db/calls/sequence-emails';
import { useSequences } from './use-sequences';

export const useSequenceEmails = (sequenceId?: string) => {
    const { allSequenceIds } = useSequences();

    const getSequenceEmailsBySequenceDBCall = useDB<typeof getSequenceEmailsBySequenceCall>(
        getSequenceEmailsBySequenceCall,
    );

    const {
        data: sequenceEmails,
        mutate: refreshSequenceEmails,
        isLoading,
    } = useSWR(sequenceId ? [sequenceId, 'sequence_email'] : null, ([id]) => getSequenceEmailsBySequenceDBCall(id));

    const getAllSequenceEmailsDBCall = useDB<typeof getAllSequenceEmailsCall>(getAllSequenceEmailsCall);
    const { data: allSequenceEmails } = useSWR(
        allSequenceIds ? [allSequenceIds, 'sequence_email'] : null,
        ([ids]) => getAllSequenceEmailsDBCall(ids),
        {
            // influencer status depends on the sequence emails, so we need to refresh this somewhat often
            refreshInterval: 1000 * 60 * 1,
        },
    );

    return {
        sequenceEmails,
        refreshSequenceEmails,
        allSequenceEmails,
        isLoading,
    };
};
