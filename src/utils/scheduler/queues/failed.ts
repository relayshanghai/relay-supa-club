import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { Default } from './default';

/**
 * Failed queue - focuses on retrying failed jobs
 */
export const Failed: JobQueue<'failed'> = {
    name: 'failed',
    run: async (payload) => {
        return await Default.run({ ...payload, status: JOB_STATUS.failed });
    },
};
