import { timingSafeEqual } from 'crypto';
import { serverLogger } from './logger-server';

const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateRandomString = (length = 10, chars = TOKEN_CHARS) => {
    let str = '';
    crypto
        .getRandomValues(new Uint32Array(length ? length : 10))
        .forEach((c) => (str += chars.charAt(c % chars.length)));
    return str;
};

/**
 * Securely compares a token string and an env var
 *
 * Generates fake tokens if env var is not properly set
 * which will ensure that the comparison will still run and return false
 */
export const checkToken = (token: string | undefined | null, envKey: string) => {
    const sEnvToken = String(process.env[envKey] ?? '');
    const sToken = String(token ?? '');

    // Notify sentry if env variable is not properly set
    if (sEnvToken === '' || typeof sEnvToken !== 'string') {
        serverLogger(`${envKey} is not properly set`);
    }

    // Determine base length of tokens; defaults to TOKEN_CHARS
    const baseLength = sEnvToken.length ? sEnvToken.length : TOKEN_CHARS.length;

    // Generate buffer for token; uses a fake if token does not match base length
    const _token = sToken.length == baseLength ? sToken : generateRandomString(baseLength);
    const bufferA = Buffer.from(_token, 'utf-8');

    // Generate buffer for env variable; uses a fake if variable is an empty string
    const envToken = sEnvToken ? sEnvToken : generateRandomString(bufferA.byteLength);
    const bufferB = Buffer.from(envToken, 'utf-8');

    try {
        return timingSafeEqual(bufferA, bufferB);
    } catch (e) {
        // While we generate fake same-length tokens to avoid `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`,
        // let's ensure that this function won't throw up in case it still happens
        serverLogger(e);
        return false;
    }
};
