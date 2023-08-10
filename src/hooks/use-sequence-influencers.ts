import { type SequenceInfluencer } from './../utils/api/db/types';
import useSWR from 'swr';
import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useSequenceInfluencers = (sequenceIds?: string[]) => {
    const db = useClientDb();

    const getInfluencers = async (sequenceId: string) => {
        const influencers = await db.getSequenceInfluencersBySequenceId(sequenceId);
        const influencersWithInfo = await Promise.all(
            influencers.map(async (influencer) => {
                const managerInfo = await db.getProfileById(influencer.added_by);
                const influencerInfo = await db.getInfluencerSocialProfileById(influencer.influencer_social_profile_id);
                return {
                    ...influencer,
                    manager_first_name: managerInfo.data?.first_name,
                    name: influencerInfo?.name,
                    username: influencerInfo?.username,
                    avatar_url: influencerInfo?.avatar_url,
                    url: influencerInfo?.url,
                };
            }),
        );
        return influencersWithInfo;
    };

    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceIds ? ['sequence_influencers', ...sequenceIds] : null,
        async () => {
            if (sequenceIds) {
                const influencersPromises = sequenceIds.map(getInfluencers);
                const influencersArrays = await Promise.all(influencersPromises);
                const combinedInfluencers = influencersArrays.reduce((accumulator, influencers) => {
                    return [...accumulator, ...influencers];
                }, []);
                return combinedInfluencers;
            }
        },
    );

    return {
        sequenceInfluencers,
        updateSequenceInfluencer: db.updateSequenceInfluencer,
        refreshSequenceInfluencers,
    };
};

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    name?: string | null;
    manager_first_name?: string;
    username?: string;
    avatar_url?: string | null;
    url?: string;
};
