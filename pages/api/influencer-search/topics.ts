import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { fetchIqDataTopicsWithContext as fetchIqDataTopics } from 'src/utils/api/iqdata';
import { IQDATA_LIST_TOPIC_TAGS, rudderstack } from 'src/utils/rudderstack';

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
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

export default ApiHandler({
    postHandler,
});
