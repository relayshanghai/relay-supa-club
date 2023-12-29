import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export type DBQuery<T> = (instance?: ReturnType<typeof drizzle>) => T;

export type DBQueryReturn<T extends (...args: any) => any> = Awaited<ReturnType<ReturnType<T>>>;

export const DB_CONN: { instance: ReturnType<typeof postgres> | null; conns: Set<number> } = {
    instance: null,
    conns: new Set(),
};

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
        debug: (conn, _query) => {
            DB_CONN.conns.add(conn);
            // console.log('POSTGRES::OPEN', conn);
        },
        onclose: (conn) => {
            DB_CONN.conns.delete(conn);
            DB_CONN.instance = null;
            // console.log('POSTGRES::CLOSE', conn, DB_CONN.conns.entries());
        },
    });

    return drizzle(DB_CONN.instance);
};

/**
 * Manually close current database connection or the passed drizzle instance
 */
export const close = async (i?: ReturnType<typeof drizzle>) => {
    // @ts-expect-error session.client is not exposed
    const instance = i?.session.client as ReturnType<typeof postgres> | null;

    const conn = instance ?? DB_CONN.instance;
    conn && (await conn.end());
};
