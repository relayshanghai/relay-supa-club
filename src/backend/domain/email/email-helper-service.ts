import {
    EmailContactEntity,
    ThreadContactEntity,
    ThreadContactType,
} from 'src/backend/database/thread/email-contact-entity';
import type { EmailEntity } from 'src/backend/database/thread/email-entity';
import { type From, type AccountMessage, type ReplyTo } from 'src/backend/integration/email-engine/account-get-message';

type Contact = From | ReplyTo;

export default class EmailHelperService {
    static service: EmailHelperService = new EmailHelperService();
    static getService(): EmailHelperService {
        return EmailHelperService.service;
    }
    async getMessageType(params: AccountMessage) {
        const emailMessage = params;
        const startsWithReplyPrefix = emailMessage.subject.toLowerCase().startsWith('re: ');
        const startsWithForwardPrefix = emailMessage.subject.toLowerCase().startsWith('fwd: ');

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

        if (
            emailMessage.specialUse === '\\All' &&
            emailMessage.messageSpecialUse === '\\Inbox' &&
            emailMessage.inReplyTo
        ) {
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
    }
    getMessageContacts(message: AccountMessage): ThreadContactEntity[] {
        const from =
            message.from ??
            message.sender ??
            (message.replyTo && message.replyTo.length > 0 ? message.replyTo[0] : null);
        const to = message.to ?? null;

        if (!from) throw new Error('Email received has no sender');
        if (!to || to.length <= 0) throw new Error('Email received has no recipients');

        const cc = message.cc ?? [];
        const bcc = message.bcc ?? [];

        const fromEntity = new ThreadContactEntity();
        fromEntity.emailContact = new EmailContactEntity();
        fromEntity.emailContact.address = from.address;
        fromEntity.emailContact.name = from.name;
        fromEntity.type = ThreadContactType.FROM;

        const toEntities = to.map((contact) => {
            const entity = new ThreadContactEntity();
            entity.emailContact = new EmailContactEntity();
            entity.emailContact.address = contact.address;
            entity.emailContact.name = contact.name;
            entity.type = ThreadContactType.TO;
            return entity;
        });

        const ccEntities = cc.map((contact) => {
            const entity = new ThreadContactEntity();
            entity.emailContact = new EmailContactEntity();
            entity.emailContact.address = contact.address;
            entity.emailContact.name = contact.name;
            entity.type = ThreadContactType.CC;
            return entity;
        });

        const bccEntities = bcc.map((contact) => {
            const entity = new ThreadContactEntity();
            entity.emailContact = new EmailContactEntity();
            entity.emailContact.address = contact.address;
            entity.emailContact.name = contact.name;
            entity.type = ThreadContactType.BCC;
            return entity;
        });
        return [fromEntity, ...toEntities, ...ccEntities, ...bccEntities];
    }
    parseMessage(email: EmailEntity){
        const { date, unseen, id, from, cc, replyTo, text, subject, attachments, to } = email.data;

        const parsed = {
            date,
            unread: unseen || false,
            id,
            from,
            to,
            attachments: attachments,
            cc: cc || [],
            replyTo,
            subject,
            body: text.html,
        }
        return parsed;
    }
    stringifyContacts(...contacts: Contact[]): string {
        return contacts
            .map((contact) => {
                return `${'name' in contact ? contact.name : ''}|${contact.address}`;
            })
            .join(',');
    }
}
