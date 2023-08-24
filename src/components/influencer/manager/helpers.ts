import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { ProfileDB, Sequence } from 'src/utils/api/db';

export const filterByMe = (influencers: SequenceInfluencerManagerPage[], profile: ProfileDB, sequences: Sequence[]) => {
    return influencers.filter((influencer) => {
        const sequence = sequences?.find((sequence) => sequence.id === influencer.sequence_id);
        if (!sequence) {
            return false;
        }
        return sequence.manager_id === profile?.id;
    });
};
