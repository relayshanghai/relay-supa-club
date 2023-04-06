import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type { GenderAllCode, InfluencerSearchRequestBody } from 'types/iqdata/influencer-search-request-body';
type NullStringTuple = [null | string, null | string];

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
    username: string;
    influencerLocation?: LocationWeighted[];
    audienceLocation?: LocationWeighted[];
    resultsPerPageLimit?: number;
    page?: number;
    audience: NullStringTuple;
    views: NullStringTuple;
    gender?: string;
    engagement?: number;
    lastPost?: string;
    contactInfo?: string;
}

const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id: Number(id),
    weight: weight ? Number(weight) / 100 : 0.5,
});

const genderTransform = (gender?: string) => {
    if (!gender) return undefined;
    const upper = gender.toUpperCase();
    const allowed: GenderAllCode[] = ['FEMALE', 'KNOWN', 'KNOWN', 'UNKNOWN'];
    if (allowed.includes(upper as GenderAllCode)) return { code: upper as GenderAllCode };
    clientLogger('bad option for gender: ' + gender, 'error');
    return undefined;
};

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',
    tags = [],
    lookalike = [],
    influencerLocation = [],
    audienceLocation = [],
    resultsPerPageLimit = 10,
    page = 0,
    username,
    audience,
    views,
    gender,
    engagement,
    lastPost,
    contactInfo,
}: FetchCreatorsFilteredParams): {
    platform: CreatorPlatform;
    body: InfluencerSearchRequestBody;
} => {
    const tagsValue = tags.map((tag: { tag: string }) => `#${tag.tag}`);
    const lookalikeValue = lookalike.map((account: CreatorAccount) => `@${account.user_id}`);
    const body: InfluencerSearchRequestBody = {
        paging: {
            limit: resultsPerPageLimit,
            skip: page ? page * resultsPerPageLimit : undefined,
        },
        filter: {
            audience_geo: audienceLocation.map(locationTransform) || [],
            geo: influencerLocation.map(locationTransform) || [],
            gender: genderTransform(gender),
            // lang: '',
            username: { value: username },
            last_posted: lastPost ? Number(lastPost) : undefined,
            views: {
                left_number: views ? Number(views[0]) ?? undefined : undefined,
                right_number: views ? Number(views[1]) ?? undefined : undefined,
            },
            followers: {
                left_number: audience ? Number(audience[0]) ?? undefined : undefined,
                right_number: audience ? Number(audience[1]) ?? undefined : undefined,
            },
            relevance: {
                value: [...tagsValue, ...lookalikeValue].join(' '),
                weight: 0.5,
            },
            actions: [{ filter: 'relevance', action: 'must' }],
            ...(contactInfo
                ? {
                      with_contact: [{ type: 'email', action: 'should' }],
                  }
                : {}),
            ...(engagement
                ? {
                      engagement_rate: {
                          value: Number((engagement / 100).toFixed(2)),
                          operator: 'gte',
                      },
                  }
                : {}),
        },
        sort: { field: 'followers', direction: 'desc' },
        audience_source: 'any',
    };
    return { platform, body };
};
