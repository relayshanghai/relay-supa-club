import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';
import { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { CreatorSearchResult } from 'types';

export type KolPostRequest = FetchCreatorsFilteredParams & {
    company_id: string;
    user_id: string;
};
export type KolPostResponse = CreatorSearchResult;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            // will need these for usage tracking when we reenable that
            company_id: _unused,
            user_id: _unused2,
            ...searchParams
        } = JSON.parse(req.body) as KolPostRequest;

        const results = await fetchCreatorsFiltered(searchParams);

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
