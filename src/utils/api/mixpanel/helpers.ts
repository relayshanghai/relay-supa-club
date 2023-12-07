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
        let match;
        let version = 'Unknown';

        if (/safari/.test(ua) && !/chrome/.test(ua)) {
            match = ua.match(/version\/(\d+)/i);
            if (match !== null) {
                version = match[1];
            }
            return { name: 'Safari', version };
        } else if (/chrome/.test(ua)) {
            match = ua.match(/chrome\/(\d+)/i);
            if (match !== null) {
                version = match[1];
            }
            return { name: 'Chrome', version };
        } else if (/firefox/.test(ua)) {
            match = ua.match(/firefox\/(\d+)/i);
            if (match !== null) {
                version = match[1];
            }
            return { name: 'Firefox', version };
        } else if (/msie/.test(ua) || /trident/.test(ua)) {
            match = ua.match(/(?:msie |rv:)(\d+)/i);
            if (match !== null) {
                version = match[1];
            }
            return { name: 'Internet Explorer', version };
        }
        return { name: 'Unknown', version };
    };
    const osMatch = /(windows|macintosh|linux)/.exec(ua);

    const osLookup: { [key: string]: string } = {
        windows: 'Windows',
        macintosh: 'Mac OS',
        linux: 'Linux',
    };

    const os = osLookup[osMatch ? osMatch[1] : ''] || 'Unknown';

    return {
        browser: getBrowser(),
        os,
    };
};
