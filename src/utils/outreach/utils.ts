import { type GetThreadsReturn } from 'src/utils/outreach/db/get-threads';

const fakeInfluencer = {
    name: 'Place Holder',
    avatarUrl: `https://api.dicebear.com/6.x/open-peeps/svg?seed=inbox-preview-relay&size=96`,
    username: 'placeholder',
    url: 'https://youtube.com/placeholder',
    funnelStatus: 'Negotiating',
    email: 'kapitanluffy+placeholder@gmail.com',
};

export const transformThreads = (threads: GetThreadsReturn) => {
    return threads.map((thread: any) => {
        return {
            threadInfo: thread.threads,
            sequenceInfluencers: thread.sequence_influencers,
            sequenceInfo: {
                ...thread.sequences,
                productName: thread.template_variables?.value,
            },
        };
    });
};
