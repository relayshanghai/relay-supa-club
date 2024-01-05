import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export type DBQuery<T> = (instance?: ReturnType<typeof drizzle>) => T;

export type DBQueryReturn<T extends (...args: any) => any> = Awaited<ReturnType<ReturnType<T>>>;

const DB_CONN: { instance: ReturnType<typeof postgres> | null } = { instance: null };

/**
 * Drizzle database
 */
export const db = (instance?: ReturnType<typeof drizzle>) => {
    if (instance) return instance;

    const connectionString = process.env.SUPABASE_CONNECTION_URL;

    if (!connectionString) {
        throw new Error('Invalid database connection URL');
    }

    if (DB_CONN.instance !== null) {
        return drizzle(DB_CONN.instance);
    }

    DB_CONN.instance = postgres(connectionString, {
        prepare: false,
        idle_timeout: 60,
        // debug: (conn) => console.log('POSTGRES', conn),
        onclose: () => {
            // console.log('CLOSING POSTGRES CONN', conn);
            DB_CONN.instance = null;
        },
    });

    return drizzle(DB_CONN.instance);
};
