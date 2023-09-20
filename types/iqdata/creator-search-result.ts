export interface CreatorSearchResult {
    total: number;
    accounts: CreatorSearchAccountObject[];
    cost: number;
    shown_accounts: any[];
}

export interface CreatorSearchAccountObject {
    account: CreatorSearchAccount;
    // TODO: get match type
    match: any;
}

export interface CreatorSearchAccount {
    user_profile: CreatorAccount;
    audience_source: 'any' | 'followers';
}

export interface CreatorAccount {
    user_id: string;
    username: string;
    url: string;
    picture: string;
    fullname: string;
    is_verified: boolean;
    account_type?: number;
    followers: number;
    engagements: number;
    /** percentage represented as a decimal */
    engagement_rate: number;
    avg_views?: number;
    custom_name?: string;
}
