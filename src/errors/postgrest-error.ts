/**
 * @see https://postgrest.org/en/stable/references/errors.html
 */
export type PostgrestError = {
    hint: string | null;
    details: string | null;
    code: string;
    message: string;
};

export const isPostgrestError = (value: any): value is PostgrestError => {
    if (typeof value !== 'object') return false;
    if ('hint' in value && 'details' in value && 'code' in value && 'message' in value) return true;

    return false;
};

/**
 * Normalize Postgrest Errors from Supabase API to Error objects
 */
export const normalizePostgrestError = (value: PostgrestError) => {
    const multi = [value.message, value.hint, value.details].filter((v) => v);
    const message = `${value.code}: ${multi.join(' | ')}`;

    return new Error(message, { cause: value });
};
