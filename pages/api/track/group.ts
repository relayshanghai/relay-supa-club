import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { mixpanelClient } from 'src/utils/api/mixpanel';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const mixpanel = mixpanelClient();

    if (!mixpanel) {
        return res.status(200).json({ message: 'Tracking disabled' });
    }

    const { groupId, ...traits } = req.body;

    try {
        mixpanel.groups.set('companyId', groupId, traits);

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
