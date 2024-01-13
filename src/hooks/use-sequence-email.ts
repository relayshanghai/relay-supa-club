import useSWR from 'swr';
import { useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceEmailAndSequencesByMessageIdCall } from 'src/utils/api/db/calls/sequence-emails';

export const useSequenceEmail = (messageId?: string) => {
    const getSequenceEmailAndSequencesByMessageIdDBCall = useDB<typeof getSequenceEmailAndSequencesByMessageIdCall>(
        getSequenceEmailAndSequencesByMessageIdCall,
    );

    const { data: sequenceEmail } = useSWR(messageId ? [messageId, 'sequence_email'] : null, ([id]) =>
        getSequenceEmailAndSequencesByMessageIdDBCall(id),
    );
    return {
        sequenceEmail,
    };
};
