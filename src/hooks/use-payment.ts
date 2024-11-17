import type { AxiosError, AxiosResponse } from 'axios';
import type { PaymentCallbackRequest } from 'pages/api/payment/callback/request';
import { type CheckoutRequest } from 'pages/api/payment/checkout/request';
import { useApiClient } from 'src/utils/api-client/request';

export const usePayment = () => {
    const { apiClient, loading, error } = useApiClient();
    const createCheckoutSession = async (data: CheckoutRequest) => {
        const response = await apiClient.post<AxiosError, AxiosResponse<{ clientSecret: string; ipAddress: string }>>(
            '/payment/checkout',
            data,
        );
        return response.data;
    };
    const callback = async (data: PaymentCallbackRequest) => {
        const response = await apiClient.post('/payment/callback', data);
        return response.data;
    };
    return { createCheckoutSession, callback, loading, error };
};
