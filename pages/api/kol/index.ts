import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

const headers = {
    'X-Api-Key': process.env.NEXT_PUBLIC_DATA_KEY!,
    'Content-Type': 'application/json'
};

const search = {
    unlocked: async (platform = 'youtube') => {
        console.log(headers);
        return await (
            await fetch(`https://socapi.icu/v2.0/api/lists/search_shown/?platform=${platform}`, {
                method: 'get',
                headers
            })
        ).json();
    },
    term: async (platform: string = 'youtube', term: string) => {
        console.log(headers);

        return await (
            await fetch(`https://socapi.icu/v2.0/api/search/newv1?platform=${platform}`, {
                method: 'post',
                headers,
                body: JSON.stringify({
                    paging: {
                        skip: null,
                        limit: 10
                    },
                    filter: {
                        audience_geo: [],
                        geo: [],
                        lang: {
                            code: 'en'
                        },
                        audience_gender: {
                            code: '',
                            weight: ''
                        },
                        gender: {
                            code: '',
                            weight: ''
                        },
                        audience_age: [],
                        age: {
                            left_number: '',
                            right_number: ''
                        },
                        followers: {
                            left_number: '',
                            right_number: ''
                        },
                        engagements: {
                            left_number: '',
                            right_number: ''
                        },
                        engagement_rate: {
                            value: null,
                            operator: 'gte'
                        },
                        last_posted: '',
                        audience_relevance: [],
                        views: {
                            left_number: '',
                            right_number: ''
                        },
                        relevance: {
                            value: term,
                            weight: 0.5
                        }
                    },
                    sort: {
                        field: 'relevance',
                        direction: 'desc'
                    },
                    audience_source: 'any'
                })
            })
        ).json();
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = JSON.parse(req.body);

        if (term.length > 2) {
            const results = await search.term(platform, term);

            console.log(results);

            return res.status(200).json(results);
        }

        return res.status(200).json([]);
    }

    return res.status(400).json(null);
}
