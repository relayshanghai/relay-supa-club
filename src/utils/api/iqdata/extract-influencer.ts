import type { CreatorReport } from 'types';
import type { InfluencerInsert, InfluencerSocialProfileInsert } from '../db';

const trimTitle = (title: string, max_length = 40) => {
    if (title.length <= max_length) {
        return title;
    }

    const tokens = title.split(' ');
    const accumulator = [];
    let length = 0;

    for (const token of tokens) {
        length += token.length;
        accumulator.push(token);
        if (length >= max_length) break;
    }

    return accumulator.join(' ').trim() + '...';
};

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
    | 'url'
    | 'username'
    | 'platform'
    | 'reference_id'
    | 'name'
    | 'email'
    | 'avatar_url'
    | 'recent_post_title'
    | 'recent_post_url'
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
        recent_post_title: trimTitle(userProfile.recent_posts?.[0]?.title ?? userProfile.recent_posts?.[0]?.text ?? ''),
        recent_post_url: userProfile.recent_posts?.[0]?.link ?? '',
    };
};

export const extractInfluencerReferenceId = (userProfile: CreatorReport['user_profile']) => {
    return `iqdata:${userProfile.user_id}`;
};
