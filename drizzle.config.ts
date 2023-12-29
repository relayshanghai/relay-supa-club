import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

export default {
    schema: './drizzle/*',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.SUPABASE_CONNECTION_URL ?? '',
    },
} satisfies Config;
