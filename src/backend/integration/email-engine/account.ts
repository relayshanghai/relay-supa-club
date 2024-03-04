export interface EmailEngineAccount {
    account: string;
    email: string;
}

export interface EmailEnginePaginatedAccount {
    accounts: EmailEngineAccount[];
    page: number;
    pages: number;
    total: number;
}
