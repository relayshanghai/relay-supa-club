import { timingSafeEqual } from 'crypto';
import { serverLogger } from './logger-server';

/**
 * Securely compares a token string and an env var
 */
export const checkToken = (token: string | undefined | null, envKey: string) => {
    const sEnvToken = String(process.env[envKey] ?? '');
    const sToken = String(token ?? '');

    // Notify sentry if env variable is not properly set
    if (sEnvToken === '') {
        serverLogger(`${envKey} is not properly set`);
    }

    if (sToken.length != sEnvToken.length) {
        return false;
    }

    const bufferA = Buffer.from(sEnvToken, 'utf-8');
    const bufferB = Buffer.from(sToken, 'utf-8');

    try {
        return timingSafeEqual(bufferA, bufferB);
    } catch (e) {
        return false;
    }
};
