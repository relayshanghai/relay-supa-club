import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { getEmails } from '../api/email-engine';
import { MAILBOX_PATH_ALL } from './constants';
import { syncEmail } from './sync-email';
import fs from 'fs';
import { db } from '../database';
import { emails } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { getProfileByEmailEngineAccount } from './db/get-profile-by-email-engine-account';
import { getInfluencerFromMessage } from './get-influencer-from-message';

type SyncAccountFn = (params: { account: string; writeLog?: boolean }) => Promise<any>;

/**
// For running it via test script
describe('Sync EmailEngine account', () => {
    it('Should sync emails', async () => {
        const accounts = [
            // ee account ids
        ]

        for (const account of accounts) {
            await syncAccount({ account, writeLog: true });
        }

        expect(true).toBe(true);
    }, 28800000); // 8 hours
});
*/

export const syncAccount: SyncAccountFn = async (params) => {
    const results: any[] = [];
    const dbresult: any[] = [];
    let totalSynced = 0;

    const profile = await getProfileByEmailEngineAccount()(params.account);

    if (!profile) throw new Error('Cannot sync a non EE account');

    // @note modify getEmailsPath pageSize to 1000 (max)
    const result = await getEmails(params.account, MAILBOX_PATH_ALL);

    // eslint-disable-next-line
    console.log('Syncing...', params.account, result.total);

    // results.push(result);

    const _syncEmail = async (email: MessagesGetMessage, totalSynced: number) => {
        // fetched emails are sorted by newest causing
        // re-synced threads to use the new email createdAt
        try {
            const emailsRow = await db()
                .select()
                .from(emails)
                .where(eq(emails.email_engine_id, `${params.account}:${email.id}`))
                .limit(1);

            const isExist = emailsRow.length === 1;

            if (isExist) {
                return {
                    id: email.id,
                    thread: email.threadId,
                    subject: email.subject,
                    labels: email.labels,
                    flags: email.flags,
                    existing: true,
                    totalSynced,
                };
            }

            const skippedReturn = {
                id: email.id,
                thread: email.threadId,
                subject: email.subject,
                labels: email.labels,
                flags: email.flags,
                skipped: true,
                totalSynced,
            };

            const influencer = await getInfluencerFromMessage({
                account: params.account,
                // @ts-expect-error
                // emailMessage is expected to not fit the shape since it is incomplete
                // we try to guess the influencer if emailMessage is provided so we can
                // quickly skip if not found
                email,
                profile,
            });
            if (!influencer) return skippedReturn;

            const syncedEmail = await syncEmail({
                account: params.account,
                emailEngineId: email.id,
                profile: profile,
                // dryRun: true,
                // skipMissingKol: true,
            });

            const logg = {
                id: email.id,
                thread: email.threadId,
                subject: email.subject,
                labels: email.labels,
                flags: email.flags,
                type: syncedEmail.messageType,
                kol: syncedEmail.influencer
                    ? `${syncedEmail.influencer.iqdata_id} | ${syncedEmail.influencer.id}`
                    : null,
                contacts: (syncedEmail.contacts ?? []).map((c) => `${c.name} <${c.address}>`),
                totalSynced,
            };
            // eslint-disable-next-line no-console
            // console.log('Syncing...', logg);
            return logg;
        } catch (error) {
            const logg = {
                account: params.account,
                emailEngineId: email.id,
                subject: email.subject,
                labels: email.labels,
                flags: email.flags,
                // @ts-expect-error thrown error can be anything
                error: error.message ? error.message : error,
                totalSynced,
            };
            // eslint-disable-next-line no-console
            // console.log('Sync error...', logg);
            return logg;
        }
    };

    let fh = null;

    try {
        fh = params.writeLog ? fs.openSync(`/tmp/outreach-sync-account-${params.account}.json`, 'a+') : null;
    } catch (error) {
        // eslint-disable-next-line
        console.log('ERROR', error);
    }

    for (const email of result.messages) {
        const _ = await _syncEmail(email, totalSynced);
        if (fh) fs.writeSync(fh, JSON.stringify(_) + '\n');
        // dbresult.push(_);
        totalSynced += 1;
    }

    for (let page = 2; page <= result.pages; page++) {
        const result = await getEmails(params.account, MAILBOX_PATH_ALL, page);

        for (const email of result.messages) {
            const _ = await _syncEmail(email, totalSynced);
            if (fh) fs.writeSync(fh, JSON.stringify(_) + '\n');
            // dbresult.push(_);
            totalSynced += 1;
        }
    }

    if (fh) fs.closeSync(fh);

    return { results, dbresult };
};
