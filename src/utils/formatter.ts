export const formatter = (num: any) => {
    if (!num) return '-';
    if (num > 999999999) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000 && num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num > 999 && num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num <= 1) return `${(Math.round(num * 10000) / 100).toFixed(2)}%`;
    if (num <= 999) return num;
};
