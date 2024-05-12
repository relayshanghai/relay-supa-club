export interface IQDataExportResult {
    account: Account;
    match: Match;
}

export interface Account {
    user_profile: InfluencerProfile;
    audience_source: string;
}

export interface InfluencerProfile {
    user_id: string;
    username: string;
    url: string;
    picture: string;
    fullname: string;
    first_name: string;
    description: string;
    is_verified: boolean;
    account_type: number;
    gender: string;
    age_group: string;
    language: Language;
    followers: number;
    engagements: number;
    engagement_rate: number;
    contacts: Contact[];
    brand_affinity: BrandAffinity[];
    interests: Interest[];
}

export interface BrandAffinity {
    id: number;
    name: string;
    interest: Interest[];
}

export interface Interest {
    id: number;
    name: string;
}

export interface Contact {
    type: string;
    value: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface Match {
    [key: string]: string;
}
