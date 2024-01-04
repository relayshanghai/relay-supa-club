import type { template_variables } from 'drizzle/schema';
import type { sequence_influencers, sequences } from 'drizzle/schema';
import type { DBQueryReturn } from '../database';
import type { ThreadsFilter } from '../endpoints/get-threads';
import { FUNNEL_STATUS } from './constants';
import { countThreads } from './db';
import type { GetThreadsReturn as dbGetThreadsReturn } from './db/get-threads';
import { getThreads as dbGetThreads } from './db';
import type { InfluencerOutreachData } from './types/influencer-outreach-data';
import { CreatorPlatform } from 'types';

export type ThreadTransformerReturn = Omit<ReturnType<typeof threadTransformer>, 'sequenceInfluencers'> & {
    sequenceInfluencers: InfluencerOutreachData | null;
};

export type GetThreadsReturn = {
    data: ThreadTransformerReturn[];
    totals: DBQueryReturn<typeof countThreads>;
};

type GetThreadsFn = (params: { account: string; filters?: ThreadsFilter }) => Promise<GetThreadsReturn>;

const sequenceInfluencerTransformer = (sequenceInfluencer: typeof sequence_influencers.$inferSelect) => {
    const funnel_status = FUNNEL_STATUS.parse(sequenceInfluencer.funnel_status);
    const platform = CreatorPlatform.parse(sequenceInfluencer.platform);

    // @bug recent_post data is empty
    return { ...sequenceInfluencer, platform, funnel_status, recent_post_title: '', recent_post_url: '' };
};

const sequenceTransformer = (
    sequence: typeof sequences.$inferSelect,
    templateVariables: typeof template_variables.$inferSelect | null,
) => {
    return {
        ...sequence,
        productName: templateVariables?.value,
    };
};

const threadTransformer = (thread: dbGetThreadsReturn) => {
    return {
        threadInfo: thread.threads,
        sequenceInfluencers: thread.sequence_influencers
            ? sequenceInfluencerTransformer(thread.sequence_influencers)
            : null,
        sequenceInfo: thread.sequences ? sequenceTransformer(thread.sequences, thread.template_variables) : null,
    };
};

export const getThreads: GetThreadsFn = async (params) => {
    const threads = await dbGetThreads()(params.account);

    const totals = await countThreads()(params.account);

    const data = threads.map(threadTransformer);

    return { data, totals };
};
