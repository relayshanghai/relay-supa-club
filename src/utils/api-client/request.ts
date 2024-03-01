import axios, { type AxiosError } from 'axios';
import { useState } from 'react';

export const useApiClient = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string[] | string>();
    const apiClient = axios.create({
        baseURL: '/api',
    });
    apiClient.interceptors.request.use((config) => {
        setLoading(true);
        return config;
    });
    apiClient.interceptors.response.use(
        (response) => {
            setLoading(false);
            setError(undefined);
            return response;
        },
        (error: AxiosError<{ messages: string[]; message: string }>) => {
            setLoading(false);
            if (error.response?.status && error.response.status >= 400) {
                setError(error.response?.data?.messages || error.response?.data?.message || 'Something went wrong');
            }
            throw error;
        },
    );
    return { apiClient, loading, error };
};
