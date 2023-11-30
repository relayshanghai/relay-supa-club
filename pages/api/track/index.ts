import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getUserSession } from 'src/utils/api/analytics';
import { mixpanelClient } from 'src/utils/api/mixpanel';
import type { DatabaseWithCustomTypes } from 'types';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { eventName, $add, ...trackingPayload } = req.body;

    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const { user_id } = await getUserSession(supabase)();

    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id' });
    } else if (!eventName) {
        return res.status(400).json({ error: 'Missing event name' });
    }

    try {
        mixpanelClient.track(eventName, {
            distinct_id: user_id,
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
