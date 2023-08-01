export interface AccountAccountMessagePut {
    flags?: Flags;
    labels?: Flags;
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
