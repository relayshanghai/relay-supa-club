export type TopUpSizes = 'small' | 'medium' | 'large';
export type TopUpDetails = {
    title: string;
    icon: string;
    amount: number;
};
export type TopUpPrices = {
    usd: number;
    cny: number;
};
export const topUpBundleDetails: Record<TopUpSizes, TopUpDetails[]> = {
    small: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 300 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 100 },
    ],
    medium: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 700 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 300 },
    ],
    large: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 1000 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 500 },
    ],
};
export const topUpPrices: Record<TopUpSizes, TopUpPrices> = {
    small: {
        cny: 88,
        usd: 13,
    },
    medium: {
        cny: 188,
        usd: 27,
    },
    large: {
        cny: 288,
        usd: 41,
    },
};
