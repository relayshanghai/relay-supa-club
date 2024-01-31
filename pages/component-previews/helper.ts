import type { SequenceInfluencersPutRequestBody } from 'pages/api/sequence-influencers';
import type { ThreadData } from './inbox';

export const optimisticUpdateSequenceInfluencer = (
    currentData: ThreadData[],
    newSequenceInfluencerData: SequenceInfluencersPutRequestBody,
): ThreadData[] => {
    // find the
    if (!currentData[0].threads) {
        return currentData;
    }
    // Find the index of the thread page that needs updating
    const pageIndex = currentData.findIndex(
        (page) =>
            page.threads.findIndex(
                (thread) => thread.threadInfo.sequence_influencer_id === newSequenceInfluencerData.id,
            ) !== -1,
    );

    const influencerIndex = currentData[pageIndex].threads.findIndex(
        (thread) => thread.threadInfo.sequence_influencer_id === newSequenceInfluencerData.id,
    );

    if (pageIndex === -1 || influencerIndex === -1) {
        return currentData;
    }

    const newThreadPages = [...currentData];
    const newThreads = [...newThreadPages[pageIndex].threads];
    const currentInfluencer = newThreads[influencerIndex].sequenceInfluencer;
    if (!currentInfluencer) {
        return currentData;
    }
    newThreads[influencerIndex] = {
        ...newThreads[influencerIndex],
        sequenceInfluencer: {
            ...currentInfluencer,
            ...newSequenceInfluencerData,
        },
    };
    newThreadPages[pageIndex] = { ...newThreadPages[pageIndex], threads: newThreads };

    return newThreadPages;
};
