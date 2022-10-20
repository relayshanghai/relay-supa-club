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
    term: async (platform: string = 'youtube', term: string, limit = 10) => {
        console.log(headers);

        return await (
            await fetch(`https://socapi.icu/v2.0/api/search/newv1?platform=${platform}`, {
                method: 'post',
                headers,
                body: JSON.stringify({
                    paging: { limit: Math.min(limit, 10), skip: null },
                    filter: {
                        audience_geo: [],
                        geo: [],
                        relevance: { value: term, weight: 0.5 },
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
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform, subscription } = JSON.parse(req.body);

        const results = await search.term(
            platform,
            term.length > 2 ? term : '',
            subscription.plans.amount
        );

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
