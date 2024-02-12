export interface AccountAccountMessagePut {
    flags?: Flags;
    labels?: Flags;
}

export interface EmailTemplatePut {
    name: string;
    description?: string;
    format: 'html';
    content: {
        subject: string;
        text?: string;
        html?: string;
    };
}

export interface EmailTemplatePutResponse {
    updated: boolean;
    account: string;
    id: string;
}

export interface Flags {
    add?: string[];
    delete?: string[];
    set?: string[];
}

export interface ResFlags {
    add: boolean;
    delete: boolean;
    set: boolean;
}

export interface UpdateMessagePutResponseBody {
    flags: ResFlags;
    labels: ResFlags;
}
