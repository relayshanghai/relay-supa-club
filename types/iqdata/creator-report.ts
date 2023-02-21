import type { CreatorPlatform, SocialMediaPlatform } from 'types/appTypes';

export interface CreatorReport {
    success: boolean;
    version: string;
    report_info: ReportInfo;
    user_profile: UserProfile;
    audience_likers: AudienceFollowers;
    audience_followers: AudienceFollowers;
    audience_commenters: AudienceFollowers;
    extra: Extra;
}
// Generated by https://quicktype.io

interface AudienceLanguage {
    id?: number;
    name?: string;
    code: string;
    weight?: number;
    coords?: Coords;
}

export interface AudienceLookalike {
    user_id: string;
    username?: string;
    picture: string;
    followers: number;
    fullname?: string;
    url: string;
    geo?: Geo;
    is_verified: boolean;
    engagements: number;
    avg_likes?: number;
    avg_views?: number;
    score?: number;
    custom_name?: string;
}

interface AudienceFollowers {
    success: boolean;
    failure: boolean;
    data: AudienceFollowersData;
}

interface AudienceFollowersData {
    audience_credibility?: number;
    credibility_class?: string;
    audience_reachability?: Audience[];
    audience_genders?: Audience[];
    audience_ages?: Audience[];
    audience_genders_per_age?: AudienceGendersPerAge[];
    audience_ethnicities?: AudienceEthnicity[];
    audience_brand_affinity?: AudienceBrandAffinity[];
    audience_interests?: AudienceEthnicity[];
    notable_users_ratio?: number;
    audience_languages?: AudienceLanguage[];
    audience_geo?: AudienceGeo;
    audience_lookalikes?: AudienceLookalike[];
    notable_users?: AudienceLookalike[];
    audience_types?: any;
}

interface Audience {
    code: string;
    weight: number;
}

interface AudienceBrandAffinity {
    id: number;
    name: string;
    interest: Interest[];
    weight: number;
    affinity: number;
}

interface Interest {
    id: number;
    name: string;
}

interface AudienceEthnicity {
    code?: string;
    name?: string;
    weight?: number;
    id?: number;
    country?: AudienceEthnicity;
    affinity?: number;
}

interface AudienceGendersPerAge {
    code: string;
    male: number;
    female: number;
}

interface AudienceGeo {
    countries: AudienceEthnicity[];
    states?: AudienceEthnicity[];
    cities?: CityElement[];
}

interface CityElement {
    id: number;
    name: string;
    coords: Coords;
    weight: number;
    state?: Interest;
    country: Country;
}

interface Coords {
    lat: number;
    lon: number;
}

interface Country {
    id: number;
    name: string;
    code: string;
}

interface Geo {
    city?: CountryClass;
    state?: CountryClass;
    country: CountryClass;
}

interface CountryClass {
    id: number;
    name: string;
    coords: Coords;
    code?: Code;
}

enum Code {
    Us = 'US',
}

interface Extra {
    followers_range: FollowersRange;
    engagement_rate_histogram: Histogram[];
    audience_credibility_followers_histogram: Histogram[];
}

interface Histogram {
    max?: number;
    total: number;
    min?: number;
    median?: boolean;
}

interface FollowersRange {
    left_number: number;
}

interface ReportInfo {
    report_id: string;
    // filter: Filter;
    // TODO: get filter type
    filter: any;
    created: string;
    profile_updated: string;
}

// interface Filter {}

interface UserProfile {
    type: CreatorPlatform;
    user_id: string;
    username: string;
    url: string;
    picture: string;
    fullname: string;
    description: string;
    is_verified: boolean;
    is_business: boolean;
    is_hidden: boolean;
    account_type: number;
    language: Language;
    followers: number;
    posts_count: number;
    engagements: number;
    engagement_rate: number;
    avg_likes: number;
    avg_comments: number;
    avg_views: number;
    stat_history: StatHistory[];
    geo: Geo;
    contacts: CreatorReportContact[];
    top_hashtags: Top[];
    top_mentions: Top[];
    total_views?: number;
    brand_affinity: BrandAffinity[];
    interests: Interest[];
    relevant_tags: RelevantTag[];
    top_posts?: Post[];
    commercial_posts?: Post[];
    recent_posts?: Post[];
    similar_users?: SimilarUser[];
}
// Generated by https://quicktype.io

export interface SimilarUser {
    user_id: string;
    custom_name: string;
    picture: string;
    followers: number;
    fullname: string;
    url: string;
    geo: SimilarUserGeo;
    is_verified: boolean;
    engagements: number;
    avg_likes: number;
    avg_views: number;
    score: number;
}

export interface SimilarUserGeo {
    country: SimilarUserCountry;
}

export interface SimilarUserCountry {
    id: number;
    name: string;
    code: string;
    coords: SimilarUserCoords;
}

export interface SimilarUserCoords {
    lat: number;
    lon: number;
}

interface BrandAffinity {
    id: number;
    name: string;
    interest: Interest[];
}
interface Sponsor {
    user_id: string;
    usename: string;
}

interface Stat {
    likes_and_views_counts_enabled?: boolean;
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
}

export interface CreatorReportContact {
    type: SocialMediaPlatform;
    value: string;
    formatted_value: string;
}

interface Language {
    code: string;
    name: string;
}

interface RelevantTag {
    tag: string;
    distance: number;
    freq: number;
}

interface StatHistory {
    month: string;
    followers: number;
    following: number;
    avg_likes: number;
}

interface Top {
    tag: string;
    weight: number;
}

export interface Post {
    user_id: string;
    username: string;
    user_picture: string;
    user_url: string;
    type: string;
    post_id: string;
    created: string;
    text: string;
    thumbnail: string;
    link: string;
    mentions?: string[];
    hashtags?: string[];
    stat: Stat;
    sponsor?: Sponsor;
    image?: string;
    title?: string;
    video?: string;
}
