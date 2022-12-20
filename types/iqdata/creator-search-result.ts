export interface CreatorSearchResult {
    total: number;
    accounts: CreatorSearchAccountObject[];
    cost: number;
    shown_accounts: any[];
}

export interface CreatorSearchAccountObject {
    account: CreatorSearchAccount;
    match: Match;
}

export interface CreatorSearchAccount {
    user_profile: CreatorAccount;
    audience_source: AudienceSource;
}

enum AudienceSource {
    Any = 'any',
    Followers = 'followers'
}

export interface CreatorAccount {
    user_id: string;
    username?: string;
    url: string;
    picture: string;
    fullname: string;
    is_verified: boolean;
    account_type?: number;
    followers: number;
    engagements: number;
    engagement_rate: number;
    avg_views?: number;
    custom_name?: string;
}

interface Match {}
