export interface GenerateAuthLinkRequestBody {
    account?: string;
    name?: string;
    email?: string;
    delegated?: boolean;
    syncFrom?: string;
    notifyFrom?: string;
    subconnections?: string[];
    redirectUrl: string;
    type?: string;
}

export interface GenerateAuthLinkResponse {
    url: string;
}
