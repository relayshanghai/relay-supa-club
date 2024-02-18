import type { DBQueryReturn } from 'src/utils/database';
import { db } from 'src/utils/database';
import { deleteEmail as baseDeleteEmail } from './db/delete-email';
import { deleteThread } from './db/delete-thread';

type DeleteEmailFn = (
    account: string,
    emailId: string,
) => Promise<{ thread: DBQueryReturn<typeof deleteThread>; email: DBQueryReturn<typeof baseDeleteEmail> }>;

export const deleteEmail: DeleteEmailFn = async (account, emailId: string) => {
    const results = await db().transaction(async (tx) => {
        const email = await baseDeleteEmail(tx)(account, emailId);
        const thread = email ? await deleteThread(tx)(email.thread_id) : null;

        return { thread, email };
    });

    return results;
};
