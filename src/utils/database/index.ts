import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export type DBQuery<T> = (instance?: ReturnType<typeof drizzle>) => T;

export type DBQueryReturn<T extends (...args: any) => any> = Awaited<ReturnType<ReturnType<T>>>;

/**
 * Drizzle database
 */
export const db = (instance?: ReturnType<typeof drizzle>) => {
    if (instance) return instance;

    const connectionString = process.env.SUPABASE_CONNECTION_URL;

    if (!connectionString) {
        throw new Error('Invalid database connection URL');
    }

    const client = postgres(connectionString, { prepare: false });

    return drizzle(client);
};
