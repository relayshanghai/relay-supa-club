import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getUserSession } from 'src/utils/api/analytics';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import { parseUserAgent } from 'src/utils/api/mixpanel/helpers';
import type { DatabaseWithCustomTypes } from 'types';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const mixpanel = mixpanelClient();

    if (!mixpanel) {
        throw new Error('Tracking disabled');
    }
    const { deviceId, eventName, $add, ...trackingPayload } = req.body;

    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const { user_id } = await getUserSession(supabase)();
    const { browser, os } = parseUserAgent(req.headers['user-agent']);
    // More information about mixpanel tracking https://docs.mixpanel.com/docs/tracking-methods/sdks/nodejs
    if (!user_id) {
        mixpanel.track(eventName, {
            $device_id: deviceId, // We need to specify a device_id while we do not have an user_id
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

    mixpanel.track(eventName, {
        $user_id: user_id, // Once we have an user_id, we can use it instead of the device_id
        $device_id: deviceId, // We need to specify a device_id to associate any previous events with this device_id with the user
        ip: req.headers['x-real-ip'],
        $os: os,
        $browser: browser.name,
        $browser_version: browser.version,
        ...trackingPayload,
    });
    mixpanel.people.increment(user_id, $add);
    return res.status(200).json({ success: true });
};

export default ApiHandler({
    postHandler,
});
