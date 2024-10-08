// Generated by https://quicktype.io

export interface CreatorReportsMetadata {
    results: CreatorReportsMetadataResult[];
}

export interface CreatorReportsMetadataResult {
    id: string;
    created_at: string;
    pdf_url: string;
    user_profile: CreatorReportsMetadataUserProfile;
}

export interface CreatorReportsMetadataUserProfile {
    user_id: string;
    username: string;
    url: string;
    fullname: string;
    picture: string;
    followers: number;
    engagements: number;
    is_business: boolean;
}
