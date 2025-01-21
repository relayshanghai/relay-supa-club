import { useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';

export const useTrialCustomers = () => {
    const { apiClient, loading, error } = useApiClient();
    const [trialCustomers, setTrialCustomers] = useState([]);
    const getTrialCustomers = async () => {
        const response = await apiClient.get('/customers/trials');
        setTrialCustomers(response.data);
        return response.data;
    };

    return { trialCustomers, getTrialCustomers, loading, error };
};
