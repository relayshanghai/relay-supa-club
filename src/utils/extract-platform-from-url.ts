export const extractPlatformFromURL = (url: string): string | null => {
    try {
        const tokens = new URL(url).hostname.toLowerCase().split('.');
        const platforms = ['youtube', 'instagram', 'tiktok'];
        return platforms.find((v: string) => tokens.indexOf(v) !== -1) || null;
    } catch {
        return null;
    }
};
