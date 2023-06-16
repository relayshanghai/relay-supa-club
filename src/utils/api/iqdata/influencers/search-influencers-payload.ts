import { z } from 'zod';

export const sort = z.object({
    field: z.union([
        z.literal('engagements'),
        z.literal('followers'),
        z.literal('engagement_rate'),
        z.literal('keywords'),
        z.literal('views'),
        z.literal('posts_count'),
        z.literal('reels_plays'),
        z.literal('followers_growth'),
        z.literal('total_views_growth'),
        z.literal('total_likes_growth'),
        z.literal('audience_geo'),
        z.literal('audience_lang'),
        z.literal('audience_brand'),
        z.literal('audience_brand_category'),
        z.literal('audience_gender'),
        z.literal('audience_race'),
        z.literal('audience_age'),
        z.literal('relevance'),
        z.literal('audience_relevance'),
    ]),
    direction: z
        .union([z.literal('desc'), z.literal('asc')])
        .default('desc')
        .optional(),
});

export const paging = z.object({
    limit: z.number(),
    skip: z.number().optional(),
});

export const audience_geo = z.object({
    id: z.number(),
    weight: z.number().optional(),
});

export const geo = z.object({
    id: z.number(),
    weight: z.number().optional(),
});

export const relevance = z.object({
    value: z.string(),
    weight: z.number().optional(),
    threshold: z.number().optional(),
});

export const text_tags = z.object({
    type: z.union([z.literal('hashtag'), z.literal('mention'), z.literal('text_mention'), z.literal('photo_mention')]),
    value: z.string(),
    action: z.union([z.literal('must'), z.literal('should'), z.literal('not')]).optional(),
});

export const username = z.object({
    value: z.string(),
    operator: z.union([z.literal('prefix'), z.literal('exact')]).optional(),
});

export const with_contact = z.object({
    type: z.union([
        z.literal('bbm'),
        z.literal('email'),
        z.literal('facebook'),
        z.literal('instagram'),
        z.literal('itunes'),
        z.literal('kakao'),
        z.literal('kik'),
        z.literal('lineid'),
        z.literal('linktree'),
        z.literal('phone'),
        z.literal('pinterest'),
        z.literal('sarahah'),
        z.literal('sayat'),
        z.literal('skype'),
        z.literal('snapchat'),
        z.literal('telegram'),
        z.literal('tiktok'),
        z.literal('tumblr'),
        z.literal('twitchtv'),
        z.literal('twitter'),
        z.literal('viber'),
        z.literal('vk'),
        z.literal('wechat'),
        z.literal('weibo'),
        z.literal('whatsapp'),
        z.literal('youtube'),
    ]),
    action: z.union([z.literal('must'), z.literal('should'), z.literal('not')]).optional(),
});

export const gender = z.object({
    code: z.union([z.literal('MALE'), z.literal('FEMALE'), z.literal('KNOWN'), z.literal('UNKNOWN')]),
});

export const views = z.object({
    left_number: z.number().optional(),
    right_nuber: z.number().optional(),
});

export const reel_plays = z.object({
    left_number: z.number().optional(),
    right_nuber: z.number().optional(),
});

export const followers = z.object({
    left_number: z.number().optional(),
    right_nuber: z.number().optional(),
});

export const engagement_rate = z.object({
    value: z.number(),
    operator: z.union([z.literal('lt'), z.literal('lte'), z.literal('gt'), z.literal('gte')]),
});

export const actions = z.object({
    filter: z.union([
        z.literal('followers'),
        z.literal('engagements'),
        z.literal('views'),
        z.literal('engagement_rate'),
        z.literal('last_posted'),
        z.literal('text'),
        z.literal('keywords'),
        z.literal('relevance'),
        z.literal('lang'),
        z.literal('gender'),
        z.literal('age'),
        z.literal('geo'),
        z.literal('brand_category'),
        z.literal('brand'),
        z.literal('with_contact'),
        z.literal('account_type'),
        z.literal('is_verified'),
        z.literal('is_hidden'),
        z.literal('is_official_artist'),
        z.literal('has_ads'),
        z.literal('ads_brands'),
        z.literal('has_audience_data'),
        z.literal('username'),
        z.literal('list'),
        z.literal('filter_ids'),
        z.literal('audience_credibility'),
        z.literal('audience_credibility_class'),
    ]),
    action: z.union([z.literal('must'), z.literal('should'), z.literal('not')]).optional(),
});

export const filter = z
    .object({
        last_posted: z.number().gte(30).optional(),
        keywords: z.string().optional(),
        text: z.string().optional(),
        // @todo customize error message via https://zod.dev/ERROR_HANDLING
        filter_ids: z.string().array().max(1000).optional(),
    })
    .extend({
        engagement_rate: engagement_rate.optional(),
        views: views.optional(),
        followers: followers.optional(),
        reels_plays: reel_plays.optional(),
        geo: geo.array().optional(),
        audience_geo: audience_geo.array().optional(),
        relevance: relevance.optional(),
        text_tags: text_tags.array().optional(),
        username: username.optional(),
        gender: gender.optional(),
        with_contact: with_contact.array().optional(),
        actions: actions.array().optional(),
    });

export const query = z.object({
    auto_unhide: z.number().or(z.boolean()).default(1),
    platform: z.string().default('youtube'),
});

export const body = z.object({
    sort: sort.optional(),
    filter: filter.optional(),
    paging: paging.optional(),
    audience_source: z
        .union([z.literal('any'), z.literal('likers'), z.literal('followers'), z.literal('commenters')])
        .optional(),
});

export const SearchInfluencersPayload = z.object({
    query: query.optional(),
    body: body.optional(),
});

export type SearchInfluencersTextTagsFilter = z.infer<typeof text_tags>;
