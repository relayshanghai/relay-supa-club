import type { AxiosError, AxiosResponse } from 'axios';
import type { PaymentCallbackRequest } from 'pages/api/payment/callback/request';
import { type CheckoutRequest } from 'pages/api/payment/checkout/request';
import { type PaymentTransactionEntity } from 'src/backend/database/payment-transaction/payment-transaction-entity';
import { useApiClient } from 'src/utils/api-client/request';
import { type CheckoutSessionType } from 'types/checkout';

export const usePayment = () => {
    const { apiClient, loading, error } = useApiClient();
    const createCheckoutSession = async (data: CheckoutRequest) => {
        const response = await apiClient.post<AxiosError, AxiosResponse<CheckoutSessionType>>(
            '/payment/checkout',
            data,
        );
        return response.data;
    };
    const callback = async (data: PaymentCallbackRequest) => {
        const response = await apiClient.post<AxiosError, AxiosResponse<PaymentTransactionEntity>>(
            '/payment/callback',
            data,
        );
        return response.data;
    };
    return { createCheckoutSession, callback, loading, error };
};
