import { z } from 'zod';
import {
    audience_age_range,
    audience_gender,
    gender_code,
    last_posted,
} from './iqdata/influencers/search-influencers-payload';
import type { NextApiRequest, NextApiResponse } from 'next';

export const ApiPayload = z.object({
    context: z
        .object<{ req: z.ZodType<NextApiRequest>; res: z.ZodType<NextApiResponse> }>({
            req: z.any(),
            res: z.any(),
        })
        .optional(),
    path: z.record(z.any()).optional(),
    query: z.record(z.any()).optional(),
    body: z.record(z.any()).optional(),
});

export type ApiPayload = z.infer<typeof ApiPayload>;

export const Platform = z.union([z.literal('youtube'), z.literal('tiktok'), z.literal('instagram')]);

export const Tag = z.object({
    tag: z.string(),
});

export const Country = z.object({
    id: z.string(),
    code: z.string(),
});

export const Location = z.object({
    id: z.string(),
    name: z.string(),
    weight: z.number(),
    type: z.string(),
    title: z.string(),
    country: Country,
});

const NullString = z.union([z.string().or(z.null()), z.string().or(z.null())]);

/**
 * @see /src/utils/api/iqdata/transforms.ts - FetchCreatorsFilteredParams
 */
export const InfluencerSearchFilter = z.object({
    platform: Platform.optional().default('youtube'),
    tags: Tag.array().optional(),
    text: z.string().optional(),
    username: z.string().optional(),
    keywords: z.string().optional(),
    influencerAge: NullString.optional(),
    influencerLocation: Location.array().optional(),
    audienceAge: audience_age_range.optional(),
    audienceLocation: Location.array().optional(),
    resultsPerPageLimit: z.number().optional().default(10),
    page: z.number().optional().default(0),
    audience: NullString.optional(),
    views: NullString.optional(),
    gender: gender_code.optional(),
    audienceGender: audience_gender.optional(),
    engagement: z.number().optional(),
    lastPost: last_posted.optional(),
    contactInfo: z.string().optional(),
    only_recommended: z.boolean().optional(),
    recommendedInfluencers: z.string().array().optional(),
    text_tags: z.string().optional(),
});

export type InfluencerSearchFilter = z.infer<typeof InfluencerSearchFilter>;
