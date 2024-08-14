'use server';

import { cookies } from 'next/headers';

export const languageCookie = async () => {
    const lc = cookies().get('language')?.value;
    return lc ?? 'en-US';
};

export const setLanguageCookie = async (language: string) => {
    cookies().set('language', language);
};
