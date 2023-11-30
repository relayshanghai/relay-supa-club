import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { mixpanelClient } from 'src/utils/api/mixpanel';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, ...propertiesPayload } = req.body;

    try {
        mixpanelClient.track('$identify', {
            distinct_id: userId,
            ip: req.headers['x-forwarded-host'],
        });

        mixpanelClient.people.set(userId, propertiesPayload);

        return res
            .status(200)
            .json({ success: true, data: req.headers['user-agent'], ip: req.headers['x-forwarded-host'] });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export default ApiHandler({
    postHandler,
});
