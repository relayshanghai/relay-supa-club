import type { template_variables } from 'drizzle/schema';
import type { sequences } from 'drizzle/schema';
import type { DBQueryReturn } from '../database';
import type { ThreadsFilter } from '../endpoints/get-threads';
import { countThreads } from './db';
import type { GetThreadsReturn as dbGetThreadsReturn } from './db/get-threads';
import { getThreads as dbGetThreads } from './db';
import type { Outreach, Thread } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';

export type GetThreadsReturn = {
    data: Thread[];
    totals: DBQueryReturn<typeof countThreads>;
};

type GetThreadsFn = (params: { account: string; filters?: ThreadsFilter }) => Promise<GetThreadsReturn>;

const sequenceTransformer = (
    sequence: typeof sequences.$inferSelect,
    templateVariables: typeof template_variables.$inferSelect | null,
): Outreach => {
    return {
        ...sequence,
        productName: templateVariables?.value,
    };
};

const threadTransformer = (thread: dbGetThreadsReturn): Thread => {
    return {
        threadInfo: thread.threads,
        sequenceInfluencers: thread.sequence_influencers
            ? influencerOutreachDataTransformer(thread.sequence_influencers)
            : null,
        sequenceInfo: thread.sequences ? sequenceTransformer(thread.sequences, thread.template_variables) : null,
    };
};

export const getThreads: GetThreadsFn = async (params) => {
    const threads = await dbGetThreads()(params.account, params.filters);

    const totals = await countThreads()(params.account);

    const data = threads.map(threadTransformer);

    return { data, totals };
};
