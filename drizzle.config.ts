import type { Config } from 'drizzle-kit';

dotenv.config({ path: './.env.local' });

export default {
    schema: './drizzle/*',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.SUPABASE_CONNECTION_URL ?? '',
    },
} satisfies Config;
