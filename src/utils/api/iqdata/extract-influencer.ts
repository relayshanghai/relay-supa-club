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

const findMostRecentPostWithTextOrTitle = (posts: CreatorReport['user_profile']['recent_posts']) => {
    const post = posts?.find((p) => p.text || p.title);

    return {
        postTitle: trimTitle(post?.title ?? post?.text ?? ''),
        postLink: post?.link,
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
    const { postTitle, postLink } = findMostRecentPostWithTextOrTitle(userProfile.recent_posts);
    return {
        url: userProfile.url,
        username: userProfile.username || userProfile.handle || userProfile.custom_name || '',
        platform: userProfile.type,
        reference_id: createInfluencerReferenceId(userProfile.user_id),
        name: userProfile.fullname || userProfile.username || userProfile.handle || userProfile.custom_name || '',
        email: email.value?.toLowerCase().trim() || '',
        avatar_url: userProfile.picture,
        recent_post_title: postTitle,
        recent_post_url: postLink,
    };
};

export const extractInfluencerReferenceId = (userProfile: CreatorReport['user_profile']) => {
    return `iqdata:${userProfile.user_id}`;
};

/**
 * @param iqdataUserId - The user id from iqdata user_profile.user_id
 * @example
 * const iqdataUserId = '1234';
 * const referenceId = createInfluencerReferenceId(iqdataUserId);
 * console.log(referenceId); // iqdata:1234
 */
export const createInfluencerReferenceId = (iqdataUserId: string) => `iqdata:${iqdataUserId}`;

/**
 *
 * @param referenceId - The reference id from influencer_social_profile.reference_id. Looks like iqdata:1234
 * @example
 * const referenceId = 'iqdata:1234';
 * const iqdataUserId = getIqdataUserIdFromReferenceId(referenceId);
 * console.log(iqdataUserId); // 1234
 */
export const getIqdataUserIdFromReferenceId = (referenceId: string) => {
    return referenceId.replace('iqdata:', '');
};
