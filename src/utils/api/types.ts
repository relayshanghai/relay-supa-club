export type ApiPayload = {
    path?: {
        [key: string]: any;
    };
    query?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    };
};
