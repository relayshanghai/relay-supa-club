import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import { parseUserAgent } from 'src/utils/api/mixpanel/helpers';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, ...propertiesPayload } = req.body;

    const { browser, os } = parseUserAgent(req.headers['user-agent']);

    try {
        const {
            firstName: $first_name,
            lastName: $last_name,
            email: $email,
            company: $company,
            ...peoplePayload
        } = propertiesPayload;

        mixpanelClient.people.set(userId, {
            $first_name,
            $last_name,
            $email,
            $company,
            ip: req.headers['x-forwarded-host'],
            $os: os,
            $browser: browser.name,
            $browser_version: browser.version,
            ...peoplePayload,
        });

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
