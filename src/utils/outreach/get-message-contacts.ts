import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import type { EmailContact } from './types';
import type { EMAIL_CONTACT_TYPE } from './constants';

type GetMessageContactsFn = (
    message: AccountAccountMessageGet,
) => Promise<(EmailContact & { type: EMAIL_CONTACT_TYPE })[]>;

export const getMessageContacts: GetMessageContactsFn = async (message) => {
    const from =
        message.from ?? message.sender ?? (message.replyTo && message.replyTo.length > 0 ? message.replyTo[0] : null);
    const to = message.to ?? null;

    if (!from) throw new Error('Email received has no sender');
    if (!to || to.length <= 0) throw new Error('Email received has no recipients');

    const cc = message.cc ?? [];
    const bcc = message.bcc ?? [];

    type cp<T> = T & { type: EMAIL_CONTACT_TYPE };

    return [
        { ...from, type: 'from' },
        ...to.map<cp<(typeof to)[0]>>((v) => {
            return { ...v, type: 'to' };
        }),
        ...cc.map<cp<(typeof cc)[0]>>((v) => {
            return { ...v, type: 'cc' };
        }),
        ...bcc.map<cp<(typeof bcc)[0]>>((v) => {
            return { ...v, type: 'bcc' };
        }),
    ];
};
