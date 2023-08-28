import type { CreatorReport } from 'types';
import type { InfluencerInsert, InfluencerSocialProfileInsert } from '../db';

export const mapIqdataProfileToInfluencer = (
    userProfile: CreatorReport['user_profile'],
): Pick<InfluencerInsert, 'name' | 'email' | 'avatar_url'> => {
    const contacts = userProfile.contacts || [];
    const email = contacts.find((v: any) => v.type === 'email') || { value: null };

    return {
        name: userProfile.fullname || userProfile.username || userProfile.handle || userProfile.custom_name || '',
        email: email.value,
        avatar_url: userProfile.picture,
        // address: "",
    };
};

// eslint-disable-next-line complexity
export const mapIqdataProfileToInfluencerSocialProfile = (
    userProfile: CreatorReport['user_profile'],
): Pick<
    InfluencerSocialProfileInsert,
    'url' | 'username' | 'platform' | 'reference_id' | 'name' | 'email' | 'avatar_url' | 'recent_video_title'
> => {
    const contacts = userProfile.contacts || [];
    const email = contacts.find((v: any) => v.type === 'email') || { value: undefined };
    return {
        url: userProfile.url,
        username: userProfile.username || userProfile.handle || userProfile.custom_name || '',
        platform: userProfile.type,
        reference_id: `iqdata:${userProfile.user_id}`,
        name: userProfile.fullname || userProfile.username || userProfile.handle || userProfile.custom_name || '',
        email: email.value,
        avatar_url: userProfile.picture,
        recent_video_title: userProfile.recent_posts?.[0]?.title || '',
    };
};

export const extractInfluencerReferenceId = (userProfile: CreatorReport['user_profile']) => {
    return `iqdata:${userProfile.user_id}`;
};
