import { registerOTel } from '@vercel/otel';
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./utils/apm');
    }
    registerOTel('next-app');
}
