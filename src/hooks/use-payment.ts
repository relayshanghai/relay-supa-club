import { AxiosError, AxiosResponse } from 'axios';
import { type CheckoutRequest } from 'pages/api/payment/checkout/request';
import { useApiClient } from 'src/utils/api-client/request';
import Stripe from 'stripe';

export const usePayment = () => {
    const { apiClient, loading, error } = useApiClient();
    const createCheckoutSession = async (data: CheckoutRequest) => {
        const response = await apiClient.post<AxiosError, AxiosResponse<{ clientSecret: string; ipAddress: string }>>(
            '/payment/checkout',
            data,
        );
        return response.data;
    };
    return { createCheckoutSession, loading, error };
};
