import type { DBQueryReturn } from 'src/utils/database';
import { db } from 'src/utils/database';
import { deleteEmail as baseDeleteEmail } from './db/delete-email';
import { deleteThread } from './db/delete-thread';

type DeleteEmailFn = (
    emailId: string,
) => Promise<{ thread: DBQueryReturn<typeof deleteThread>; email: DBQueryReturn<typeof baseDeleteEmail> }>;

export const deleteEmail: DeleteEmailFn = async (emailId: string) => {
    const results = await db().transaction(async (tx) => {
        const email = await baseDeleteEmail(tx)(emailId);
        const thread = email ? await deleteThread(tx)(email.thread_id) : null;

        return { thread, email };
    });

    return results;
};