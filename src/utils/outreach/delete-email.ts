import { deleteThreadByEmailId } from './db/delete-thread-by-email-id';
import type { DBQueryReturn } from 'src/utils/database';
import { db } from 'src/utils/database';
import { deleteEmail as _deleteEmail } from './db/delete-email';

type DeleteEmailFn = (
    emailId: string,
) => Promise<{ thread: DBQueryReturn<typeof deleteThreadByEmailId>; email: DBQueryReturn<typeof _deleteEmail> }>;

export const deleteEmail: DeleteEmailFn = async (emailId: string) => {
    const results = db().transaction(async (tx) => {
        const thread = await deleteThreadByEmailId(tx)(emailId);
        const email = await _deleteEmail(tx)(emailId);

        return { thread, email };
    });

    return results;
};
