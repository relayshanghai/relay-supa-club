import type { sequences, template_variables } from 'drizzle/schema';
import type { DBQueryReturn } from '../database';
import type { ThreadsFilter } from '../endpoints/get-threads';
import { countThreads } from './db';
import { getFilteredThreadCount, type GetThreadsReturn as dbGetThreadsReturn } from './db/get-threads';
import { getThreads as dbGetThreads } from './db';
import type { Outreach, Thread, ThreadContact } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';
import { getThreadContacts } from './db/get-thread-contacts';
import type { SearchTableInfluencer } from 'types';
import { searchMessages } from './email-engine/search-messages';

export type GetThreadsReturn = {
    data: Thread[];
    totals: DBQueryReturn<typeof countThreads>;
    totalFiltered: number;
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

const threadTransformer = (thread: dbGetThreadsReturn, contacts: ThreadContact[]): Thread => {
    return {
        threadInfo: thread.threads,
        sequenceInfluencer: thread.sequence_influencers
            ? influencerOutreachDataTransformer(thread.sequence_influencers, thread.influencer_social_profiles)
            : null,
        influencerSocialProfile: thread.influencer_social_profiles?.data as SearchTableInfluencer,
        contacts,
        sequenceInfo: thread.sequences ? sequenceTransformer(thread.sequences, thread.template_variables) : null,
    };
};

export const getThreads: GetThreadsFn = async (params) => {
    if (params.filters?.searchTerm) {
        const body = {
            documentQuery: {
                query_string: {
                    query: params.filters?.searchTerm,
                },
            },
        };
        const result = await searchMessages(params.account, body);
        params.filters.threadIds = result.messages.map((message) => message.threadId);
    }
    const threads = await dbGetThreads()(params.account, params.filters);
    const threadContacts = await getThreadContacts()(
        params.account,
        ...threads.map((thread) => thread.threads.thread_id),
    );
    const contacts: Record<string, ThreadContact[]> = threadContacts.reduce((acc, contact) => {
        if (!contact.email_contacts) {
            return acc;
        }
        if (!acc[contact.thread_contacts.thread_id]) {
            acc[contact.thread_contacts.thread_id] = [];
        }
        acc[contact.thread_contacts.thread_id].push({
            ...contact.email_contacts,
            name: contact.email_contacts?.name || contact.email_contacts?.address,
            type: contact.thread_contacts.type,
        } as ThreadContact);
        return acc;
    }, {} as Record<string, ThreadContact[]>);

    const totals = await countThreads()(params.account);

    const totalFiltered = await getFilteredThreadCount()(params.account, params.filters);

    const data = threads.map((thread) => {
        return threadTransformer(thread, contacts[thread.threads.thread_id]);
    });

    return { data, totals, totalFiltered };
};
