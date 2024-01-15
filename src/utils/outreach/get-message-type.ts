import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import type { MESSAGE_TYPES } from './constants';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';

type GetMessageTypeFn = (params: {
    message: AccountAccountMessageGet | WebhookMessageNew['data'];
}) => Promise<MESSAGE_TYPES>;

export const getMessageType: GetMessageTypeFn = async (params) => {
    const emailMessage = params.message;

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Sent') {
        return 'Sent';
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Inbox' && emailMessage.inReplyTo) {
        return 'Reply';
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Inbox') {
        return 'New';
    }

    if (emailMessage.specialUse === '\\Trash') {
        return 'Trash';
    }

    if (emailMessage.labels.includes('\\Draft')) {
        return 'Draft';
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.labels.includes('Warmup')) {
        return 'Warmup';
    }

    throw new Error('Unknown message type');
};
