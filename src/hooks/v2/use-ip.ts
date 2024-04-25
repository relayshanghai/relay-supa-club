/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';

export const useIp = () => {
    const [ip, setIp] = useState<string | null>(null);
    const { apiClient, loading } = useApiClient('https://api.ipify.org');
    useEffect(() => {
        if (ip) return;
        if (loading) {
            return;
        }
        apiClient.get('/?format=json').then((res) => {
            setIp(res.data.ip);
        });
    }, []);
    useEffect(() => {
        if (loading) {
            return;
        }
        apiClient.get('/?format=json').then((res) => {
            setIp(res.data.ip);
        });
    }, []);
    return ip;
};
