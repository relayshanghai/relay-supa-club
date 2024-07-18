export const hasCustomError = (error: any, customErrors: { [key: string]: string }) =>
    error?.message && Object.values(customErrors).includes(error.message.split(' - ERR:')[0]);
