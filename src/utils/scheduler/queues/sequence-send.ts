import type { JobQueue } from '../types';
import { Default } from './default';

const SEQUENCE_SEND_QUEUE_NAME = 'sequence_send';

/**
 * SequenceSend queue
 */
export const SequenceSend: JobQueue<typeof SEQUENCE_SEND_QUEUE_NAME> = {
    name: SEQUENCE_SEND_QUEUE_NAME,
    run: async (payload) => {
        return await Default.run({ ...payload, queue: SEQUENCE_SEND_QUEUE_NAME });
    },
};
