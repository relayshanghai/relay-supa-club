import type { JobQueue } from '../types';
import { Default } from './default';

export const SEQUENCE_STEP_SEND_QUEUE_NAME = 'sequence_step_send';

/**
 * SequenceStepSend queue
 */
export const SequenceStepSend: JobQueue<typeof SEQUENCE_STEP_SEND_QUEUE_NAME> = {
    name: SEQUENCE_STEP_SEND_QUEUE_NAME,
    run: async (payload) => {
        return await Default.run({ ...payload, queue: SEQUENCE_STEP_SEND_QUEUE_NAME });
    },
};
