import type { JobQueue } from '../types';
import { Default } from './default';

const QUEUE_NAME = 'analytics';

/**
 * Analytics queue
 */
export const Analytics: JobQueue<typeof QUEUE_NAME> = {
    name: QUEUE_NAME,
    run: async (payload) => {
        return await Default.run({ ...payload, queue: QUEUE_NAME });
    },
};
