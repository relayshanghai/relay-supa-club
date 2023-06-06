export const extractPlatformFromURL = (url: string): string | null => {
    const hostname = new URL(url).hostname.toLowerCase();

    const youtubeRegex = /^(www\.)?youtu(\.be|be\.com)$/;
    const instagramRegex = /^(www\.)?instagram\.com$/;
    const tiktokRegex = /^(www\.)?(vt\.|vm\.)?tiktok\.com$/;

    if (youtubeRegex.test(hostname)) {
        return 'youtube';
    } else if (instagramRegex.test(hostname)) {
        return 'instagram';
    } else if (tiktokRegex.test(hostname)) {
        return 'tiktok';
    }

    return null;
};
