import axios, { type AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
export const apiClient = axios.create({
    baseURL: `${publicUrl}/api`,
});

export const useApiClient = (baseUrl?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string[] | string>();
    const { t } = useTranslation();
    const apiClient = axios.create({
        baseURL: baseUrl || '/api',
    });
    const translated = (msg: string | string[]) => {
        if (Array.isArray(msg)) {
            return msg.map((m) => t(m));
        }
        return t(msg);
    };
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
                const tr = translated(
                    error.response?.data?.messages || error.response?.data?.message || 'Something went wrong',
                );
                setError(tr);
            }
            throw error;
        },
    );
    return { apiClient, loading, error, setError };
};
