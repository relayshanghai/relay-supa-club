export interface CreatorSearchResult {
    total: number;
    accounts: CreatorSearchAccountObject[];
    cost: number;
    shown_accounts: any[];
}

export interface CreatorSearchAccountObject {
    account: CreatorSearchAccount;
    match: MatchType;
}

export interface CreatorSearchAccount {
    user_profile: CreatorAccount;
    audience_source: 'any' | 'followers';
}

export interface CreatorAccount {
    user_id: string;
    username?: string;
    handle?: string;
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

export interface MatchType {
    audience_likers?: {
        data: AudienceLikers;
    };
    user_profile?: UserProfileMatch;
}

export interface AudienceLikers {
    audience_ages?: AudienceAge[];
    audience_age_range?: AudienceAge;
    audience_brand_affinity?: BrandAffinity[];
    audience_credibility?: number;
    audience_ethnicities?: Ethnicity[];
    audience_genders?: Gender[];
    audience_genders_per_age?: GenderPerAge[];
    audience_geo?: AudienceGeo;
    audience_interests?: Interest[];
    audience_languages?: Language[];
    credibility_class?: string;
    relevance?: number;
}

export interface UserProfileMatch {
    ads_brands?: BrandAffinity[];
    age_group?: string;
    avg_reels_plays?: number;
    avg_shares?: number;
    avg_saves?: number;
    brand_affinity?: BrandAffinity[];
    distance?: number;
    followers_growth?: number;
    gender?: string;
    geo?: UserProfileGeo;
    interests?: Interest[];
    language?: Language;
    posts_count?: number;
    relevance?: number;
    total_likes_growth?: number;
    total_views_growth?: number;
}

interface AudienceAge {
    code: string;
    weight: number;
}

interface BrandAffinity {
    id: number;
    name: string;
    interest: Interest[];
    weight: number;
    affinity: number;
}

interface Ethnicity {
    code: string;
    name: string;
    weight: number;
}

interface Gender {
    code: string;
    weight: number;
}

interface GenderPerAge {
    code: string;
    male?: number;
    female?: number;
}

interface AudienceGeo {
    countries: AudienceCountry[];
    states?: State[];
    cities?: City[];
}

interface Country {
    id: number;
    name: string;
    code: string;
    coords: Coords;
}

interface AudienceCountry {
    id: number;
    name: string;
    code: string;
    weight: number;
}

interface State {
    id: number;
    name: string;
    weight: number;
    country: Partial<Country>;
}

interface City {
    id: number;
    name: string;
    coords: Coords;
    weight: number;
    country: Partial<Country>;
}

interface Coords {
    lat: number;
    lon: number;
}

interface Interest {
    id: number;
    name: string;
}

interface Language {
    code: string;
    name: string;
}

interface UserProfileGeo {
    city?: City;
    state?: State;
    country: Country;
}
