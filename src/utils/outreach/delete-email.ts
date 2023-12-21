import type { DBQueryReturn } from 'src/utils/database';
import { db } from 'src/utils/database';
import { deleteEmail as _deleteEmail } from './db/delete-email';
import { deleteThread } from './db/delete-thread';

type DeleteEmailFn = (
    emailId: string,
) => Promise<{ thread: DBQueryReturn<typeof deleteThread>; email: DBQueryReturn<typeof _deleteEmail> }>;

export const deleteEmail: DeleteEmailFn = async (emailId: string) => {
    const results = db().transaction(async (tx) => {
        const email = await _deleteEmail(tx)(emailId);
        const thread = email ? await deleteThread(tx)(email.threadId) : null;

        return { thread, email };
    });

    return results;
};
