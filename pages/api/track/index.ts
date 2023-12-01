import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getUserSession } from 'src/utils/api/analytics';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import { parseUserAgent } from 'src/utils/api/mixpanel/helpers';
import type { DatabaseWithCustomTypes } from 'types';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    let body = req.body;
    if (req.headers['content-type']?.includes('text/plain')) {
        body = JSON.parse(req.body);
    }

    const { deviceId, eventName, $add, ...trackingPayload } = body;

    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const { user_id } = await getUserSession(supabase)();
    const { browser, os } = parseUserAgent(req.headers['user-agent']);

    if (!user_id) {
        mixpanelClient.track(eventName, {
            $device_id: deviceId,
            ip: req.headers['x-real-ip'],
            $os: os,
            $browser: browser.name,
            $browser_version: browser.version,
            ...trackingPayload,
        });
        return res.status(200).json({ success: true });
    } else if (!eventName) {
        return res.status(400).json({ error: 'Missing event name' });
    }

    try {
        mixpanelClient.track(eventName, {
            $user_id: user_id,
            $device_id: deviceId,
            ip: req.headers['x-real-ip'],
            $os: os,
            $browser: browser.name,
            $browser_version: browser.version,
            ...trackingPayload,
        });
        mixpanelClient.people.increment(user_id, $add);
        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export default ApiHandler({
    postHandler,
});
