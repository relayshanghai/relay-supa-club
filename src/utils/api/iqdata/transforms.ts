import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type { InfluencerSearchRequestBody } from 'types/iqdata/influencer-search-request-body';
type NullStringTuple = [null | string, null | string];

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
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
    id,
    weight: weight ? Number(weight) / 100 : 0.5,
});

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',

    tags = [],
    lookalike = [],
    influencerLocation = [],
    audienceLocation = [],
    resultsPerPageLimit = 10,
    page = 0,
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
            gender: gender ? { code: gender.toUpperCase() } : '',
            lang: '',
            last_posted: lastPost || '',
            views: {
                left_number: views ? views[0] ?? '' : '',
                right_number: views ? views[1] ?? '' : '',
            },
            followers: {
                left_number: audience ? audience[0] ?? '' : '',
                right_number: audience ? audience[1] ?? '' : '',
            },
            username: { value: 'GRTR' },
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
                          value: (engagement / 100).toFixed(2),
                          operator: 'gte',
                      },
                  }
                : {}),
        } as any,
        sort: { field: 'followers', direction: 'desc' },
        audience_source: 'any',
    };
    return { platform, body };
};
