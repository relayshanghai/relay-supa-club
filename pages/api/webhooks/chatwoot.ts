import type { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { ChatwootConversation, ChatwootWebhookEvent, ChatwootWebwidgetTriggered } from 'src/utils/chatwoot/types';
import { ConversationCreatedEvent, WebwidgetTriggeredEvent } from 'src/utils/rudderstack/events';
import { createClient } from 'src/utils/rudderstack/rudderstack';

const postHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.token !== process.env.CHATWOOT_WEBHOOK_TOKEN) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    const body: ChatwootWebhookEvent = req.body;

    if (body.event === 'webwidget_triggered') {
        const payload = body as ChatwootWebwidgetTriggered;
        const rudderstack = createClient();

        if (!rudderstack) return;

        WebwidgetTriggeredEvent(rudderstack)({
            account_id: payload.account.id,
        });
    }

    if (body.event === 'conversation_created') {
        const payload = body as ChatwootConversation;
        const rudderstack = createClient();

        if (!rudderstack) return;

        ConversationCreatedEvent(rudderstack)({
            account_id: payload.account_id,
        });
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
