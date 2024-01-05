import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const SUPABASE_CONNECTION_URL = process.env.SUPABASE_CONNECTION_URL ?? '';
if (!SUPABASE_CONNECTION_URL) {
    throw new Error('SUPABASE_CONNECTION_URL not set');
}

export default {
    schema: './drizzle/*',
    driver: 'pg',
    dbCredentials: {
        connectionString: SUPABASE_CONNECTION_URL,
    },
} satisfies Config;
