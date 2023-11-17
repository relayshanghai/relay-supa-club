import type { JobQueue } from '../types';
import { Blocking } from './blocking';

const QUEUE_NAME = 'analytics';

/**
 * Analytics queue
 */
export const Analytics: JobQueue<typeof QUEUE_NAME> = {
    name: QUEUE_NAME,
    run: async (payload) => {
        return await Blocking.run({ ...payload, queue: QUEUE_NAME });
    },
};
