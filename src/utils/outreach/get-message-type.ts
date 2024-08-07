import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import type { MESSAGE_TYPES } from './constants';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';

type GetMessageTypeFn = (params: {
    message: AccountAccountMessageGet | WebhookMessageNew['data'];
}) => Promise<{ type: MESSAGE_TYPES; weight: number }>;

/**
 * Guesses the type of email message
 *
 *  Returns a type and a weight. The weight determines how sure the guess is. The closer to 0, the more confident the guess.
 *
 *  @NOTICE FOR DEVELOPERS, make sure that no two same types return the same weight
 */
export const getMessageType: GetMessageTypeFn = async (params) => {
    const emailMessage = params.message;
    const startsWithReplyPrefix = emailMessage.subject?.toLowerCase().startsWith('re: ');
    const startsWithForwardPrefix = emailMessage.subject?.toLowerCase().startsWith('fwd: ');

    // The following conditions that use messageSpecialUse are most likely gmail emails

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Sent') {
        return { type: 'Sent', weight: 0 };
    }

    if (
        emailMessage.specialUse === '\\All' &&
        emailMessage.messageSpecialUse === '\\Inbox' &&
        emailMessage.inReplyTo &&
        startsWithReplyPrefix
    ) {
        return { type: 'Reply', weight: 0 };
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Inbox' && emailMessage.inReplyTo) {
        return { type: 'Reply', weight: 1 };
    }

    if (
        emailMessage.specialUse === '\\All' &&
        emailMessage.messageSpecialUse === '\\Inbox' &&
        !emailMessage.inReplyTo &&
        startsWithForwardPrefix
    ) {
        return { type: 'Forward', weight: 0 };
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.messageSpecialUse === '\\Inbox') {
        return { type: 'New', weight: 0 };
    }

    if (emailMessage.specialUse === '\\Trash') {
        return { type: 'Trash', weight: 0 };
    }

    if (emailMessage.labels.includes('\\Draft')) {
        return { type: 'Draft', weight: 0 };
    }

    // Looking around, there's really no guarantee that emails with warmup labels to be Warmup emails
    // For now, we just assume that if an email has a label Warmup, it is a warmup
    if (emailMessage.specialUse === '\\All' && emailMessage.labels.includes('Warmup')) {
        return { type: 'Warmup', weight: 1 };
    }

    // The following conditions below are now more fine-grained and should not use messageSpecialUse

    if (emailMessage.specialUse === '\\All' && emailMessage.inReplyTo && startsWithReplyPrefix) {
        return { type: 'Reply', weight: 2 };
    }

    if (emailMessage.specialUse === '\\All' && emailMessage.inReplyTo) {
        return { type: 'Reply', weight: 3 };
    }

    if (emailMessage.specialUse === '\\All' && !emailMessage.inReplyTo && startsWithReplyPrefix) {
        return { type: 'Forward', weight: 2 };
    }

    if (emailMessage.specialUse === '\\All' && !emailMessage.inReplyTo && startsWithForwardPrefix) {
        return { type: 'Forward', weight: 1 };
    }

    if (emailMessage.specialUse === '\\All' && !emailMessage.inReplyTo && !startsWithReplyPrefix) {
        return { type: 'New', weight: 1 };
    }

    throw new Error('Unknown message type');
};
