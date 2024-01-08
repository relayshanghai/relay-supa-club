import type { sequences, template_variables } from 'drizzle/schema';
import type { DBQueryReturn } from '../database';
import type { ThreadsFilter } from '../endpoints/get-threads';
import { countThreads } from './db';
import type { GetThreadsReturn as dbGetThreadsReturn } from './db/get-threads';
import { getThreads as dbGetThreads } from './db';
import type { Outreach, Thread, ThreadContact } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';
import { getThreadContacts } from './db/get-thread-contacts';

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

const threadTransformer = (thread: dbGetThreadsReturn, contacts: ThreadContact[]): Thread => {
    return {
        threadInfo: thread.threads,
        sequenceInfluencers: thread.sequence_influencers
            ? influencerOutreachDataTransformer(thread.sequence_influencers)
            : null,
        contacts,
        sequenceInfo: thread.sequences ? sequenceTransformer(thread.sequences, thread.template_variables) : null,
    };
};

export const getThreads: GetThreadsFn = async (params) => {
    const threads = await dbGetThreads()(params.account, params.filters);
    const contacts: { [k: string]: ThreadContact[] } = {};

    for (const thread of threads) {
        // @todo move to a function getThreadContacts
        const threadContacts = await getThreadContacts()(thread.threads.thread_id);
        contacts[thread.threads.thread_id] = threadContacts
            .filter((contact) => contact.email_contacts !== null)
            .map((contact) => {
                return { ...contact.email_contacts, type: contact.thread_contacts.type };
            }) as ThreadContact[];
    }

    const totals = await countThreads()(params.account);

    const data = threads.map((thread) => {
        return threadTransformer(thread, contacts[thread.threads.thread_id]);
    });

    return { data, totals };
};
