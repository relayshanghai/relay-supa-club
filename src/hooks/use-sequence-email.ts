import useSWR from 'swr';
import { useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceEmailAndSequencesByMessageIdCall } from 'src/utils/api/db/calls/sequence-emails';

export const useSequenceEmail = (messageId?: string) => {
    const getSequenceEmailAndSequencesByMessageIdDBCall = useDB<typeof getSequenceEmailAndSequencesByMessageIdCall>(
        getSequenceEmailAndSequencesByMessageIdCall,
    );
    if (!messageId) {
        throw new Error('No message id found');
    }
    const { data: sequenceEmail } = useSWR('sequence_email', () =>
        getSequenceEmailAndSequencesByMessageIdDBCall(messageId),
    );
    return {
        sequenceEmail,
    };
};
