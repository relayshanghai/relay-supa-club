export const truncatedText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

export const generateUrlIfTiktok = (url?: string | null, username?: string | null): string => {
    if (!url) {
        return '';
    }
    return url.includes('https://www.tiktok.com/@') ? `https://www.tiktok.com/@${username}` : url;
};
