import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { addresses } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';

import { z } from 'zod';

export type Address = typeof addresses.$inferSelect;

export const addressesInsertSchema = createInsertSchema(addresses);
export type AddressesInsert = typeof addressesInsertSchema._type;

export const addressesUpdateSchema = addressesInsertSchema.partial().extend({ id: z.string().uuid() });
export type AddressesUpdate = z.infer<typeof addressesUpdateSchema>;

export const updateAddressCall: DBQuery<(update: AddressesUpdate) => Promise<Address>> =
    (databaseInstance) => async (update) => {
        const result = await db(databaseInstance)
            .update(addresses)
            .set(update)
            .where(eq(addresses.id, update.id))
            .returning();

        if (result.length !== 1) throw new Error('Error in updating row');

        return result[0];
    };
