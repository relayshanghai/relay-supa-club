import type { CreatorReport } from 'types';
import type { InfluencerInsert, InfluencerSocialProfileInsert } from '../db/calls/influencers';

export const mapIqdataProfileToInfluencer = (
    userProfile: CreatorReport['user_profile'],
): Pick<InfluencerInsert, 'name' | 'email' | 'avatar_url'> => {
    const contacts = userProfile.contacts || [];
    const email = contacts.find((v: any) => v.type === 'email') || { value: null };

    return {
        name: userProfile.fullname,
        email: email.value,
        avatar_url: userProfile.picture,
        // address: "",
    };
};

export const mapIqdataProfileToInfluencerSocialProfile = (
    userProfile: CreatorReport['user_profile'],
): Pick<InfluencerSocialProfileInsert, 'url' | 'username' | 'platform' | 'reference_id'> => {
    return {
        url: userProfile.url,
        username: userProfile.username || userProfile.handle || userProfile.custom_name || '',
        platform: userProfile.type,
        reference_id: `iqdata:${userProfile.user_id}`,
    };
};

export const extractInfluencerReferenceId = (userProfile: CreatorReport['user_profile']) => {
    return `iqdata:${userProfile.user_id}`;
};
