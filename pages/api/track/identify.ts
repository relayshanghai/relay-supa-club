import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import { parseUserAgent } from 'src/utils/api/mixpanel/helpers';

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return; // If circular reference, return undefined
            }
            seen.add(value);
        }
        return value;
    };
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, ...propertiesPayload } = req.body;
    const jsonString = JSON.stringify(req, getCircularReplacer());
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

        return res.status(200).json({ success: true, data: jsonString });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export default ApiHandler({
    postHandler,
});
