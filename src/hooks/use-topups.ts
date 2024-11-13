import { useApiClient } from 'src/utils/api-client/request';
import { useLocalStorage } from './use-localstorage';
import { useCompany } from './use-company';

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
export type TopUpOptions = Record<TopUpSizes, TopUpPrices>;
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
export const topUpPrices: TopUpOptions = {
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

export const STRIPE_SELECTED_TOPUP_BUNDLE = 'boostbot_stripe_bundle_response';
export const selectedTopupBundle: {
    topupPrice: TopUpSizes | undefined;
} = { topupPrice: undefined };

export const useLocalSelectedTopupBundle = () => useLocalStorage(STRIPE_SELECTED_TOPUP_BUNDLE, selectedTopupBundle);
export const useTopUpPlan = () => {
    const { apiClient, loading, error } = useApiClient();
    const { company } = useCompany();

    return {};
};
