import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import { parseUserAgent } from 'src/utils/api/mixpanel/helpers';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, ...propertiesPayload } = req.body;
    const { browser, os } = parseUserAgent(req.headers['user-agent']);

    const {
        firstName: $first_name,
        lastName: $last_name,
        email: $email,
        company: $company,
        ...peoplePayload
    } = propertiesPayload;
    // Refer for more info https://docs.mixpanel.com/docs/tracking-methods/sdks/nodejs#setting-profile-properties
    mixpanelClient.people.set(userId, {
        $first_name,
        $last_name,
        $email,
        $company,
        $os: os,
        ip: req.headers['x-real-ip'],
        $browser: browser.name,
        $browser_version: browser.version,
        ...peoplePayload,
    });

    return res.status(200).json({ success: true });
};

export default ApiHandler({
    postHandler,
});
