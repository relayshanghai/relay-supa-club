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

export const audience_age_range = z.object({
    left_number: z
        .union([z.literal('13'), z.literal('18'), z.literal('25'), z.literal('35'), z.literal('45'), z.literal('65')])
        .optional(),
    right_number: z
        .union([z.literal('17'), z.literal('24'), z.literal('34'), z.literal('44'), z.literal('64')])
        .optional(),
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

const gender_code_enum = z.union([z.literal('MALE'), z.literal('FEMALE'), z.literal('KNOWN'), z.literal('UNKNOWN')]);

export const gender_code = z
    .string()
    .transform((v) => v.toUpperCase() as z.infer<typeof gender_code_enum>)
    .refine((v) => gender_code_enum.safeParse(v).success);

export const gender = z.object({
    code: gender_code,
});

const audience_gender_code_enum = z.enum(['MALE', 'FEMALE']);

export const audience_gender_code = z
    .string()
    .transform((v) => v.toUpperCase() as z.infer<typeof audience_gender_code_enum>)
    .refine((v) => audience_gender_code_enum.safeParse(v).success);

export const audience_gender = z.object({
    code: audience_gender_code,
    weight: z.number().optional(),
});

// prettier-ignore
const lang_code_enum = z.enum(["en", "es", "pt", "fr", "ar", "ru", "it", "de", "fa", "id", "tr", "ja", "pl", "th", "zh", "hi", "ms", "uk", "ko", "nl", "arz", "ne", "az", "pa", "gu", "sv", "kk", "he", "ro", "ckb", "cs", "vi", "ur", "mr", "ky", "hu", "el", "ml", "bn", "ca", "fi", "no", "da", "bg", "sr", "sw", "hr", "sq", "tl", "sk", "ta", "sh", "sl", "ps", "mk", "km", "kn", "hy", "uz", "gl", "ce", "af", "azb", "lt", "ceb", "si", "et", "tg", "tt", "as", "pnb", "ka", "bs", "lv", "lo", "te", "am", "my", "mn", "is", "sah", "mzn", "ku", "sd", "or", "gd", "fy", "so", "be", "war", "als", "mhr", "ie", "ba", "tk", "ia", "nds", "jv", "dv", "jbo", "ug", "gn", "bo", "nap", "ilo", "mg", "su", "ga", "io", "lez", "min", "ht", "kw", "bh", "new", "yue", "ast", "mai", "yi", "cv", "pms", "hsb", "sa", "sco", "bar", "xmf", "pam", "xh", "krc", "lrc", "zu", "bpy", "wuu", "rw", "mrj", "gv", "os", "cbk", "eml", "lmo", "gom", "myv", "rm", "li", "scn", "kv", "bcl", "bxr", "av", "vep", "sc", "xal", "tyv", "nah", "diq", "mwl", "yo", "dty", "vec", "vls", "dsb", "pfl", "co", "frr", "rue"]);

const lang = z.object({
    code: lang_code_enum,
});

export const views = z.object({
    left_number: z.number().optional(),
    right_number: z.number().optional(),
});

export const reel_plays = z.object({
    left_number: z.number().optional(),
    right_number: z.number().optional(),
});

export const followers = z.object({
    left_number: z.number().optional(),
    right_number: z.number().optional(),
});

export const age = z.object({
    left_number: z.number().optional(),
    right_number: z.number().optional(),
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

export const followers_growth = z.object({
    interval: z
        .union([
            z.literal('i1month'),
            z.literal('i2months'),
            z.literal('i3months'),
            z.literal('i4months'),
            z.literal('i5months'),
            z.literal('i6months'),
        ])
        .optional(),
    value: z.number(),
    operator: z.union([z.literal('lt'), z.literal('lte'), z.literal('gt'), z.literal('gte')]),
});

const posts_count = z.object({
    left_number: z.number().optional(),
    right_number: z.number().optional(),
});

export const last_posted = z
    .string()
    .or(z.number())
    .transform((v) => +v)
    .pipe(z.number().gte(30));

export const filter = z
    .object({
        last_posted: last_posted.optional(),
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
        age: age.optional(),
        geo: geo.array().optional(),
        audience_age_range: audience_age_range.optional(),
        audience_geo: audience_geo.array().optional(),
        relevance: relevance.optional(),
        text_tags: text_tags.array().optional(),
        username: username.optional(),
        gender: gender.optional(),
        audience_gender: audience_gender.optional(),
        with_contact: with_contact.array().optional(),
        actions: actions.array().optional(),
        lang: lang.optional(),
        followers_growth: followers_growth.optional(),
        posts_count: posts_count.optional(),
    });

export type filter = z.infer<typeof filter>;

export const platform_enum = z.enum(['instagram', 'youtube', 'tiktok']).default('youtube');

export const query = z.object({
    auto_unhide: z.number().or(z.boolean()).default(1),
    platform: platform_enum,
});

export const body = z.object({
    sort: sort.optional(),
    filter: filter.optional(),
    paging: paging.optional(),
    audience_source: z
        .union([z.literal('any'), z.literal('likers'), z.literal('followers'), z.literal('commenters')])
        .optional(),
});

/**
 * @see /types/iqdata/influencer-search-request-body.ts
 */
export const SearchInfluencersPayload = z.object({
    query: query.optional(),
    body: body.optional(),
});

export type SearchInfluencersPayload = z.infer<typeof SearchInfluencersPayload>;

export const SearchInfluencersPayloadRequired = z.object({
    query: query,
    body: body,
});

export type SearchInfluencersPayloadRequired = z.infer<typeof SearchInfluencersPayloadRequired>;

export type SearchInfluencersTextTagsFilter = z.infer<typeof text_tags>;
