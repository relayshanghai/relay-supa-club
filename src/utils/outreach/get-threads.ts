import type { DBQueryReturn } from '../database';
import type { ThreadsFilter } from '../endpoints/get-threads';
import { countThreads } from './db';
import type { GetThreadsWithReplyReturn } from './db/get-threads-with-reply';
import { getThreadsWithReplyByFilter } from './db/get-threads-with-reply';

export type GetThreadsReturn = {
    data: ReturnType<typeof threadTransformer>[];
    totals: DBQueryReturn<typeof countThreads>;
};

type GetThreadsFn = (params: { account: string; filters?: ThreadsFilter }) => Promise<GetThreadsReturn>;

const threadTransformer = (thread: GetThreadsWithReplyReturn) => {
    return {
        threadInfo: thread.threads,
        sequenceInfluencers: thread.sequence_influencers,
        sequenceInfo: {
            ...thread.sequences,
            productName: thread.template_variables?.value,
        },
    };
};

export const getThreads: GetThreadsFn = async (params) => {
    const threads = await getThreadsWithReplyByFilter()(params.account, params.filters);

    const totals = await countThreads()(params.account, params.filters);

    const data = threads.map(threadTransformer);

    return { data, totals };
};
