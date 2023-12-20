import { getEmails } from '../api/email-engine';
import { MAILBOX_PATH_ALL } from './constants';
import { syncEmail } from './sync-email';

type SyncAccountFn = (params: { account: string }) => Promise<any>;

export const syncAccount: SyncAccountFn = async (params) => {
    const results = [];
    const dbresult = [];

    const result = await getEmails(params.account, MAILBOX_PATH_ALL);
    results.push(result);

    for (const email of result.messages) {
        // skip drafts
        if (email.labels.includes('\\Draft')) {
            continue;
        }

        const _ = await syncEmail({
            account: params.account,
            emailEngineId: email.id,
        });

        dbresult.push(_);
    }

    for (let page = 2; page <= result.pages; page++) {
        const result = await getEmails(params.account, MAILBOX_PATH_ALL, page);

        // @todo too lazy to create function for this
        for (const email of result.messages) {
            if (email.labels.includes('\\Draft')) {
                continue;
            }

            const _ = await syncEmail({
                account: params.account,
                emailEngineId: email.id,
            });

            dbresult.push(_);
        }
    }

    // const emails = await getMailboxes(params.account);

    return { results, dbresult };
};
