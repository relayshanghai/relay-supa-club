import { z } from 'zod';
import { FUNNEL_STATUS, THREAD_STATUS } from '../outreach/constants';
import type { GetThreadsReturn } from '../outreach/get-threads';

export const SequenceThreadsFilter = z.object({
    id: z.string(),
    name: z.string(),
});

export type SequenceThreadsFilter = z.infer<typeof SequenceThreadsFilter>;

export const ThreadsFilter = z.object({
    threadStatus: THREAD_STATUS.array().optional(),
    funnelStatus: FUNNEL_STATUS.array().optional(),
    sequences: SequenceThreadsFilter.array().optional(),
    threadIds: z.string().array().optional(),
    page: z.number(),
});

export type ThreadsFilter = z.infer<typeof ThreadsFilter>;

export const GetThreadsApiRequest = z.object({
    body: ThreadsFilter.optional(),
});

export type GetThreadsApiRequest = z.infer<typeof GetThreadsApiRequest>;

export type GetThreadsApiResponse = {
    data: GetThreadsReturn['data'];
    totals: GetThreadsReturn['totals'];
    totalFiltered: number;
};
