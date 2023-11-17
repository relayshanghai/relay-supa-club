import type { JobQueue } from '../types';
import { Blocking } from './blocking';

const SEQUENCE_SEND_QUEUE_NAME = 'sequence_send';

/**
 * SequenceSend queue
 */
export const SequenceSend: JobQueue<typeof SEQUENCE_SEND_QUEUE_NAME> = {
    name: SEQUENCE_SEND_QUEUE_NAME,
    run: async (payload) => {
        return await Blocking.run({ ...payload, queue: SEQUENCE_SEND_QUEUE_NAME });
    },
};
