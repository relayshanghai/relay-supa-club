export const extractPlatformFromURL = (url: string): string | null => {
    const hostname = new URL(url).hostname.toLowerCase();

    // @todo refactor to use regex
    const platforms = {
        youtube: ['www.youtube.com', 'youtube.com', 'youtu.be'],
        instagram: ['www.instagram.com', 'instagram.com'],
        tiktok: ['vt.tiktok.com', 'www.tiktok.com', 'tiktok.com'],
    };

    for (const [platform, hostnames] of Object.entries(platforms)) {
        if (hostnames.indexOf(hostname) !== -1) {
            return platform;
        }
    }

    return null;
};
