import { z } from 'zod';
import { audience_age, audience_gender } from './iqdata/influencers/search-influencers-payload';

export type ApiPayload = {
    path?: {
        [key: string]: any;
    };
    query?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    };
};

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

const GenderUpper = z.union([z.literal('MALE'), z.literal('FEMALE'), z.literal('KNOWN'), z.literal('UNKNOWN')]);

export const Gender = z
    .string()
    .transform((v) => v.toUpperCase() as z.infer<typeof GenderUpper>)
    .refine((v) => GenderUpper.safeParse(v).success);

type Gender = z.output<typeof Gender>;

export const LastPosted = z.number().min(30);

const NullString = z.union([z.string().or(z.null()), z.string().or(z.null())]);

export const InfluencerSearchFilter = z.object({
    platform: Platform.optional().default('youtube'),
    tags: Tag.array().optional(),
    text: z.string().optional(),
    username: z.string().optional(),
    keywords: z.string().optional(),
    influencerAge: NullString.optional(),
    influencerLocation: Location.array().optional(),
    audienceAge: audience_age.optional(),
    audienceLocation: Location.array().optional(),
    resultsPerPageLimit: z.number().optional().default(10),
    page: z.number().optional().default(0),
    audience: NullString.optional(),
    views: NullString.optional(),
    gender: z.string().optional(),
    audienceGender: audience_gender.optional(),
    engagement: z.number().optional(),
    lastPost: z.string().optional(),
    contactInfo: z.string().optional(),
    only_recommended: z.boolean().optional(),
    recommendedInfluencers: z.string().array().optional(),
    text_tags: z.string().optional(),
});

export type InfluencerSearchFilter = z.infer<typeof InfluencerSearchFilter>;
