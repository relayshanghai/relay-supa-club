import axios, { type AxiosError } from 'axios';
import { useState } from 'react';

const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
export const apiClient = axios.create({
    baseURL: `${publicUrl}/api`,
});

export const useApiClient = (baseUrl?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string[] | string>();
    const apiClient = axios.create({
        baseURL: baseUrl || '/api',
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
    return { apiClient, loading, error, setError };
};
