import type { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { ChatwootWebhookEvent } from 'src/utils/chatwoot/types';

const postHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.token !== process.env.CHATWOOT_WEBHOOK_TOKEN) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    const body: ChatwootWebhookEvent = req.body;

    if (body.event === 'webwidget_triggered') {
    }

    if (body.event === 'conversation_created') {
    }

    if (body.event === 'conversation_status_changed') {
    }

    if (body.event === 'conversation_updated') {
    }

    if (body.event === 'message_created') {
    }

    if (body.event === 'message_updated') {
    }

    return res.status(httpCodes.NOT_FOUND).json({ error: 'Not found' });
};

export default ApiHandler({
    postHandler,
});
