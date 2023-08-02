/**
 * Return the current timestamp
 */
export const timestamp = () => new Date().getTime();

/**
 * Return the current iso string
 */
export const now = () => new Date().toISOString();

/**
 * Convert the timestamp to an ISO string
 */
export const toISO = (timestamp: number | string) => new Date(+timestamp).toISOString();
