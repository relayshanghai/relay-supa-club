export type RelayErrorOptions = {
    shouldLog?: boolean;
};

export class RelayError extends Error {
    readonly _httpCode: number;
    readonly _shouldLog: boolean;

    constructor(msg: string, httpCode = 500, options?: RelayErrorOptions) {
        super(msg);
        this._httpCode = httpCode;
        this._shouldLog = options?.shouldLog || true; // log to server by default
    }

    get httpCode() {
        return this._httpCode;
    }

    get shouldLog() {
        return this._shouldLog;
    }
}
