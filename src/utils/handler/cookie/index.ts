import { getCookie, setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cryptr from 'cryptr';
import type { Nullable } from 'types/nullable';
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET ?? 'cookie-secret';
const cryptr = new Cryptr(ENCRYPTION_SECRET);
export interface Cookies {
    set: <T>(key: string, value: T) => void;
    get: <T = string>(key: string) => Nullable<T>;
}

export const setCookieFunction = (req: NextApiRequest, res: NextApiResponse) => {
    return <T>(key: string, value: T) => {
        const encrypted = cryptr.encrypt(JSON.stringify(value));
        setCookie(key, encrypted, {
            req,
            res,
            maxAge: 24 * 60 * 60,
        });
    };
};

export const getCookieFunction = (req: NextApiRequest) => {
    return <T = string>(key: string): Nullable<T> => {
        const result = getCookie(key, {
            req,
        });
        if (!result) return undefined;
        const decrypted = cryptr.decrypt(result.toString());
        return JSON.parse(decrypted);
    };
};
