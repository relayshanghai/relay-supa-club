import { getInfluencerSocialProfileByIdCall as getInfluencerSocialProfileById } from 'src/utils/api/db/calls/influencers';
import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { type SequenceInfluencerManagerPage } from 'src/hooks/use-sequence-influencers';
import type { ProfileDB, ProfileDBInsert, ProfileDBUpdate } from 'src/utils/api/db';
import { getProfileById } from 'src/utils/api/db';
import { getSequenceInfluencersBySequenceIdCall as getSequenceInfluencersBySequenceId } from 'src/utils/api/db/calls/sequence-influencers';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from 'src/utils/api/iqdata';

export type ProfilePutBody = ProfileDBUpdate & { id: string };
export type ProfilePutResponse = ProfileDB;
export type ProfileInsertBody = ProfileDBInsert;

const getSequenceInfluencers = async (ctx: ServerContext, sequenceId: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const influencers = await getSequenceInfluencersBySequenceId(supabase)(sequenceId);
    const influencersWithInfo = await Promise.all(
        influencers.map(async (influencer: SequenceInfluencerManagerPage) => {
            const managerInfo = await getProfileById(influencer.added_by);
            const influencerInfo = await getInfluencerSocialProfileById(supabase)(
                influencer.influencer_social_profile_id,
            );
            return {
                ...influencer,
                manager_first_name: managerInfo?.data?.first_name,
                name: influencerInfo?.name,
                username: influencerInfo?.username,
                avatar_url: influencerInfo?.avatar_url,
                url: influencerInfo?.url,
            };
        }),
    );
    return influencersWithInfo;
};

const handler: NextApiHandler = async (req, res) => {
    const sequenceIds: string[] = req.body;
    const influencersPromises = sequenceIds.map((sequenceId) => getSequenceInfluencers({ req, res }, sequenceId));
    const influencersArrays = await Promise.all(influencersPromises);
    const combinedInfluencers = influencersArrays.reduce((accumulator, influencers) => {
        return [...accumulator, ...influencers];
    }, []);
    return res.status(httpCodes.OK).json(combinedInfluencers);
};

export default handler;
