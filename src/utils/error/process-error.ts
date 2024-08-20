import { AxiosError } from 'axios';

export const processErrorMessage = (error: any) => {
    if (error instanceof AxiosError) {
        if (error?.response?.data) {
            return error?.response?.data;
        }
        return error.response ?? error.message;
    } else if (error instanceof Error) {
        return error.message;
    }
};
