import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const useOtp = () => {
    const { apiClient, loading, error, setError } = useApiClient();
    const [isVerified, setIsVerified] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [counter, setCounter] = useState(0);
    const sendOtp = async (phoneNumber: string, recaptchaToken?: string) => {
        setIsOtpSent(false);
        const [err] = await awaitToError(apiClient.post('/users/send-otp', { phoneNumber, recaptchaToken }));
        if (err) return;
        setIsOtpSent(true);
        startInterval();
    };
    const verify = async (code: string) => {
        const [err] = await awaitToError<AxiosError<{ message: string }>>(apiClient.put('/users/verify', { code }));
        if (err) {
            return false;
        }
        setIsVerified(true);
        return true;
    };
    const startInterval = () => {
        setCounter(60);
        const interval = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
        }, 60000);
    };
    return { sendOtp, loading, verify, isVerified, isOtpSent, setIsVerified, setIsOtpSent, counter, error, setError };
};
