export type PostgrestError = {
    hint: string | null;
    details: string | null;
    code: string;
    message: string;
};

export const isPostgrestError = (value: any): value is PostgrestError => {
    if ('hint' in value && 'details' in value && 'code' in value && 'message' in value) return true;

    return false;
};

export const normalizePostgrestError = (value: PostgrestError) => {
    const multi = [value.message, value.hint, value.details].filter((v) => v);
    const message = `${value.code}: ${multi.join(' | ')}`;

    return new Error(message);
};
