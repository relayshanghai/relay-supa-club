import useSWR from 'swr';
import { useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceEmailByMessageIdCall } from 'src/utils/api/db/calls/sequence-emails';

export const useSequenceEmail = (messageId?: string) => {
    const getSequenceEmailByMessageIdDBCall = useDB<typeof getSequenceEmailByMessageIdCall>(
        getSequenceEmailByMessageIdCall,
    );
    if (!messageId) {
        throw new Error('No message id found');
    }
    const { data: sequenceEmail } = useSWR('sequence_email', () => getSequenceEmailByMessageIdDBCall(messageId));
    return {
        sequenceEmail,
    };
};
