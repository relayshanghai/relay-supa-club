export const parseUserAgent = (userAgent?: string) => {
    if (!userAgent) {
        return {
            browser: {
                name: 'Unknown',
                version: 'Unknown',
            },
            os: 'Unknown',
        };
    }
    const ua = userAgent.toLowerCase();
    const getBrowser = () => {
        const match = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const version = match[2] || 'Unknown';

        if (/safari/.test(ua) && !/chrome/.test(ua)) {
            return { name: 'Safari', version };
        } else if (/chrome/.test(ua)) {
            return { name: 'Chrome', version };
        } else if (/firefox/.test(ua)) {
            return { name: 'Firefox', version };
        } else if (/msie/.test(ua)) {
            return { name: 'Internet Explorer', version };
        }
        return { name: 'Unknown', version };
    };

    const getOS = () => {
        if (/windows/.test(ua)) {
            return 'Windows';
        } else if (/macintosh/.test(ua)) {
            return 'Mac OS';
        } else if (/linux/.test(ua)) {
            return 'Linux';
        }
        return 'Unknown';
    };

    return {
        browser: getBrowser(),
        os: getOS(),
    };
};
