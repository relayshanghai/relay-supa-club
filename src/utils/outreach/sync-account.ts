import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { getEmails } from '../api/email-engine';
import { MAILBOX_PATH_ALL } from './constants';
import { syncEmail } from './sync-email';

type SyncAccountFn = (params: { account: string }) => Promise<any>;

export const syncAccount: SyncAccountFn = async (params) => {
    const results = [];
    const dbresult = [];

    const result = await getEmails(params.account, MAILBOX_PATH_ALL);
    results.push(result);

    const _syncEmail = async (email: MessagesGetMessage) => {
        // eslint-disable-next-line no-console
        console.log('Syncing...', email.id, email.messageId, email.threadId, email.from, email.to);

        // fetched emails are sorted by newest causing
        // re-synced threads to use the new email createdAt
        return await syncEmail({
            account: params.account,
            emailEngineId: email.id,
        });
    };

    for (const email of result.messages) {
        const _ = await _syncEmail(email);
        dbresult.push(_);
    }

    for (let page = 2; page <= result.pages; page++) {
        const result = await getEmails(params.account, MAILBOX_PATH_ALL, page);

        for (const email of result.messages) {
            const _ = await _syncEmail(email);
            dbresult.push(_);
        }
    }

    return { results, dbresult };
};
