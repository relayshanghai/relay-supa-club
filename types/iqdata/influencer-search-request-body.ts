/** from https://iqdata.social/docs/api#operation/search-for-influencers Last updated April/5/2023, https://socapi.icu/v2.0/api/search/newv1/ endpoint */
export interface InfluencerSearchRequestBody {
    filter: InfluencerSearchRequestBodyFilter;
    sort: Sort;
    paging: Paging;
    audience_source: 'any' | 'likers' | 'followers' | 'commenters';
}
// TODO: get this types more exact. In IQdata api docs you can click the value to expand it!
export interface InfluencerSearchRequestBodyFilter {
    audience_age?: AudienceGenderElement[];
    audience_age_range?: AudienceAgeRange;
    audience_brand?: AudienceBrandElement[];
    audience_brand_category?: AudienceBrandElement[];
    audience_gender?: AudienceGenderElement;
    audience_geo?: AudienceBrandElement[];
    audience_lang?: AudienceGenderElement;
    audience_race?: AudienceGenderElement;
    audience_relevance?: AudienceRelevance;
    brand?: number[];
    brand_category?: number[];
    engagements?: Engagements;
    views?: Engagements;
    posts_count?: Engagements;
    reels_plays?: Engagements;
    followers?: Engagements;
    gender?: Gender;
    age?: Age;
    geo?: Geo[];
    lang?: Gender;
    followers_growth?: SGrowth;
    total_views_growth?: SGrowth;
    total_likes_growth?: SGrowth;
    relevance?: Relevance;
    text?: string;
    keywords?: string;
    text_tags?: TextTag[];
    engagement_rate?: EngagementRate;
    is_hidden?: boolean;
    is_verified?: boolean;
    account_type?: number[];
    has_ads?: boolean;
    ads_brands?: number[];
    with_contact?: WithContact[];
    audience_credibility?: number;
    audience_credibility_class?: string[];
    list?: List[];
    filter_ids?: string[];
    is_official_artist?: boolean;
    last_posted?: number;
    has_audience_data?: boolean;
    username?: Username;
    actions?: Action[];
}

interface Action {
    filter: string;
    action: string;
}

interface Age {
    left_number: string;
    right_number: string;
}

interface AudienceGenderElement {
    code: string;
    weight: number;
}

interface AudienceAgeRange {
    left_number: string;
    right_number: string;
    weight: number;
    operator: string;
}

interface AudienceBrandElement {
    id: number;
    weight: number;
}

interface AudienceRelevance {
    value: string;
}

interface EngagementRate {
    value: number;
    operator: string;
}

interface Engagements {
    left_number: number;
    right_number: number;
}

interface SGrowth {
    interval: string;
    value: number;
    operator: string;
}

interface Gender {
    code: string;
}

interface Geo {
    id: number;
}

interface List {
    id: number;
    action: string;
}

interface Relevance {
    value: string;
    weight: number;
    threshold: number;
}

interface TextTag {
    type: string;
    value: string;
    action: string;
}

interface Username {
    value: string;
    operator?: 'prefix' | 'exact';
}

interface WithContact {
    type: string;
    action: string;
}

interface Paging {
    /** integer (Limit) <= 100 */
    limit: number;
    skip?: number;
}

interface Sort {
    field:
        | 'engagements'
        | 'followers'
        | 'engagement_rate'
        | 'keywords'
        | 'views'
        | 'posts_count'
        | 'reels_plays'
        | 'followers_growth'
        | 'total_views_growth'
        | 'total_likes_growth'
        | 'audience_geo'
        | 'audience_lang'
        | 'audience_brand'
        | 'audience_brand_category'
        | 'audience_gender'
        | 'audience_race'
        | 'audience_age'
        | 'relevance'
        | 'audience_relevance';
    /** Affects only for sort by audience_geo, audience_brand or audience_brand_category fields to specify most audience segment to sort by according to your filter */
    id?: number;
    /** Default: "desc" */
    direction?: 'asc' | 'desc';
}
