/* eslint-disable arrow-body-style */
const handleError = (error) => {
    if (!error || typeof error !== 'object') return 'Oops! Something went wrong. Try again';
    const { response } = error;
    if (response?.data?.error) {
        return response.data.error;
    }
    if (response?.data?.errors) {
        return `${Object.keys(response.data.errors)[0]} ${
            response.data.errors[Object.keys(response.data.errors)[0]]
        }`;
    }
    if (response?.data?.email) {
        return `${Object.keys(response.data)[0]} ${response.data.email[0]}`;
    }
    return 'Oops! Something went wrong. Try again';
};

function numFormatter(num) {
    if (!num) return '-';
    if (num > 999999999) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000 && num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num > 999 && num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num <= 999) return num;
}

function dateFormatter(date, withTime, options = {}) {
    const d = new Date(date);
    const params = options;
    if (!params.year) params.year = 'numeric';
    if (!params.month) params.month = 'short';
    if (!params.day) params.day = 'numeric';
    // console.log('date:', d);
    const dateFormatted = d.toLocaleDateString(undefined, params);
    const dateAndTimeFormatted = `${dateFormatted} at ${d.toLocaleTimeString('en-US')}`;
    if (withTime) {
        return dateAndTimeFormatted;
    } else {
        return dateFormatted;
    }
}

function addhttps(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'https://' + url;
    }
    return url;
}

function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + ttl,
        m
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

function roundPercentage(num) {
    return Math.round(num * 100);
}

function isEmail(string) {
    const matcher = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (string.length > 320) return false;
    return matcher.test(string);
}

function isValidUrl(string) {
    const matchpattern =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(string);
}

const truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    const sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

export const chinaFilter = (str) => {
    if (!str) return 'N/A';
    const filteredLocations = ['taiwan', 'hong kong'];
    if (filteredLocations.includes(str.toLowerCase())) return `China (${str})`;
    return str;
};

const toCurrency = (n, curr = 'USD', LanguageFormat = undefined) =>
    Intl.NumberFormat(LanguageFormat, {
        style: 'currency',
        currency: curr
    }).format(n);

export {
    handleError,
    numFormatter,
    dateFormatter,
    roundPercentage,
    setWithExpiry,
    getWithExpiry,
    addhttps,
    truncate,
    isEmail,
    toCurrency,
    isValidUrl
};
