import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIqDataTopicsWithContext as fetchIqDataTopics } from 'src/utils/api/iqdata';
import { IQDATA_LIST_TOPIC_TAGS, rudderstack } from 'src/utils/rudderstack';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = req.body;

        await rudderstack.identify({ req, res });

        rudderstack.track({
            event: IQDATA_LIST_TOPIC_TAGS,
            payload: {
                term,
                platform,
            },
        });

        const results = await fetchIqDataTopics({ req, res })(term, platform);
        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
