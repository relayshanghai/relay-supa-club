import { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
    KOLLocation?: LocationWeighted[];
    audienceLocation?: LocationWeighted[];
    limit?: number;
    page?: number;
    audience?: string;
    views?: string[];
    gender?: string;
    engagement?: number;
    lastPost?: string;
    contactInfo?: string;
}

const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id,
    weight: weight ? Number(weight) / 100 : 0.5
});

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',

    tags = [],
    lookalike = [],
    KOLLocation = [],
    audienceLocation = [],
    limit = 10,
    page = 0,
    audience,
    views,
    gender,
    engagement,
    lastPost,
    contactInfo
}: FetchCreatorsFilteredParams) => {
    const tagsValue = tags.map((tag: { tag: string }) => `#${tag.tag}`);
    const lookalikeValue = lookalike.map((item: CreatorAccount) => `@${item.user_id}`);
    const body = {
        paging: {
            limit: page === 0 ? Math.min(limit, 10) : Math.min(Math.max(limit - page * 10, 0), 10),
            skip: page ? page * 10 : null
        },
        filter: {
            audience_geo: audienceLocation.map(locationTransform) || [],
            geo: KOLLocation.map(locationTransform) || [],
            gender: gender ? { code: gender.toUpperCase() } : '',
            lang: '',
            last_posted: lastPost || '',
            views: {
                left_number: views ? views[0] : '',
                right_number: views ? views[1] : ''
            },
            followers: {
                left_number: audience ? audience[0] : '',
                right_number: audience ? audience[1] : ''
            },
            relevance: {
                value: [...tagsValue, ...lookalikeValue].join(' '),
                weight: 0.5
            },
            actions: [{ filter: 'relevance', action: 'must' }],
            ...(contactInfo
                ? {
                      with_contact: [{ type: 'email', action: 'should' }]
                  }
                : {}),
            ...(engagement
                ? {
                      engagement_rate: {
                          value: (engagement / 100).toFixed(2),
                          operator: 'gte'
                      }
                  }
                : {})
        },
        sort: { field: 'followers', direction: 'desc' },
        audience_source: 'any'
    };
    return { platform, body };
};
