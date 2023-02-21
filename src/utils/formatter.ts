/** converts a decimal to a percent, assuming that the decimal is a base 100 percent, e.g. .15 -> 15%, 1.5 -> 150%. Uses two decimals after the zero max and rounds the last */
export const decimalToPercent = (num?: number | string) => {
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
        maximumFractionDigits: 2,
    }).format(number);
};

/**
 * @description converts number to compact format e.g. 1000 -> 1K, 1000000 -> 1M. Keeps 2 decimals max. e.g. 1.2345 -> 1.23
 */
export const numberFormatter = (num?: number | string) => {
    let number = num;
    if (number === 0 || number === '0') {
        return '0';
    }
    if (typeof num === 'string') {
        number = Number(num);
    }
    if (!number || typeof number !== 'number') {
        return null;
    }

    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(number);
};
