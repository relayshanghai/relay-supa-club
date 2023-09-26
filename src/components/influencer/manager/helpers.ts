import Fuse from 'fuse.js';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { CommonStatusType } from 'src/components/library';
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

export const filterInfluencers = (
    searchTerm: string,
    onlyMe: boolean,
    filterStatuses: CommonStatusType[],
    profile: ProfileDB,
    sequenceInfluencers: SequenceInfluencerManagerPage[],
    sequences?: Sequence[],
) => {
    let influencers = sequenceInfluencers;

    if (onlyMe && sequences) {
        influencers = filterByMe(influencers, profile, sequences);
    }

    if (filterStatuses.length > 0) {
        influencers = influencers.filter((x) => filterStatuses.includes(x.funnel_status));
    }

    if (searchTerm.length > 0) {
        const fuse = new Fuse(influencers, {
            keys: ['name', 'username'],
        });

        influencers = fuse.search(searchTerm).map((x) => x.item);
    }

    return influencers;
};
