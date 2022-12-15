import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'src/utils/api/constants';
import { searchSubscription } from 'src/utils/api/subscription/search';

const location = ({ id, weight }: any) => ({ id, weight: weight ? parseFloat(weight) / 100 : 0.5 });

const search = {
    unlocked: async (platform = 'youtube') => {
        return await (
            await fetch(`https://socapi.icu/v2.0/api/lists/search_shown/?platform=${platform}`, {
                method: 'get',
                headers
            })
        ).json();
    },
    term: async (platform = 'youtube', term: string, limit = 10, page = 0) => {
        return await (
            await fetch(`https://socapi.icu/v2.0/api/search/newv1?platform=${platform}`, {
                method: 'post',
                headers,
                body: JSON.stringify({
                    paging: {
                        limit:
                            page === 0
                                ? Math.min(limit, 10)
                                : Math.min(Math.max(limit - page * 10, 0), 10),
                        skip: page ? page * 10 : null
                    },
                    filter: {
                        audience_geo: [],
                        geo: [],
                        relevance: { value: term.replace(/\s+/g, '_'), weight: 0.5 },
                        gender: '',
                        lang: '',
                        last_posted: '',
                        views: { left_number: '', right_number: '' },
                        followers: { left_number: '', right_number: '' }
                    },
                    sort: { field: 'followers', direction: 'desc' },
                    audience_source: 'any'
                })
            })
        ).json();
    },
    tags: async ({
        platform = 'youtube',
        tags = [],
        lookalike = [],
        KOLLocation,
        audienceLocation,
        limit = 10,
        page = 0,
        audience,
        views,
        gender,
        engagement,
        lastPost,
        contactInfo
    }: any) => {
        const tagsValue = tags.map((tag: any) => `#${tag.tag}`);
        const lookalikeValue = lookalike.map((item: any) => `@${item.user_id}`);

        return await (
            await fetch(
                `https://socapi.icu/v2.0/api/search/newv1?platform=${platform}&auto_unhide=true`,
                {
                    method: 'post',
                    headers,
                    body: JSON.stringify({
                        paging: {
                            limit:
                                page === 0
                                    ? Math.min(limit, 10)
                                    : Math.min(Math.max(limit - page * 10, 0), 10),
                            skip: page ? page * 10 : null
                        },
                        filter: {
                            audience_geo: audienceLocation.map(location) || [],
                            geo: KOLLocation.map(location) || [],
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
                    })
                }
            )
        ).json();
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, ...rest } = JSON.parse(req.body);

        const subscriptions = await searchSubscription({ company_id });
        const limit = subscriptions.data.length > 0 ? 100 : 10;

        const results = await search.tags({
            limit,
            ...rest
        });

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
