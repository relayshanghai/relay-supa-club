import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

export default {
    out: './drizzle',
    schema: './drizzle/*',
    driver: 'pg',
    introspect: {
        casing: 'preserve',
    },
    dbCredentials: {
        connectionString: process.env.SUPABASE_CONNECTION_URL ?? '',
    },
} satisfies Config;
