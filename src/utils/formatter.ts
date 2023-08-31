/** converts a decimal to a percent, assuming that the decimal is a base 100 percent, e.g. .15 -> 15%, 1.5 -> 150%. Uses two decimals by default after the zero max and rounds the last */
export const decimalToPercent = (num?: number | string, decimals = 2) => {
    let number = num;
    if (number === 0 || number === '0') {
        return '0%';
    }
    if (typeof num === 'string') {
        number = Number(num);
    }
    if (!number || typeof number !== 'number') {
        return null;
    }
    return Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: decimals,
    }).format(number);
};

/**
 * @description converts number to compact format e.g. 1000 -> 1K, 1000000 -> 1M. Keeps 2 decimals by default. e.g. 1.2345 -> 1.23
 */
export const numberFormatter = (num?: number | string, decimals = 2) => {
    const number = typeof num === 'string' && num !== '' ? Number(num) : num;

    if (number === 0) {
        return '0';
    }

    if (!number || typeof number !== 'number') {
        return null;
    }

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: decimals,
        }).format(num);

    if (number >= 1e8) {
        return formatNumber(Math.floor(number / 1e7) * 1e7) + '+';
    }

    if (number >= 1e7) {
        decimals = 0;
    }

    if (number >= 1e5) {
        return formatNumber(Math.floor(number / 1e4) * 1e4) + '+';
    }

    if (number >= 1e4) {
        return formatNumber(Math.floor(number / 1e4) * 1e4) + '+';
    }

    return formatNumber(number);
};
