/** from https://iqdata.social/docs/api#operation/search-for-influencers Last updated April/5/2023, https://socapi.icu/v2.0/api/search/newv1/ endpoint */
export interface InfluencerSearchRequestBody {
    filter: InfluencerSearchRequestBodyFilter;
    sort: Sort;
    paging: Paging;
    audience_source: 'any' | 'likers' | 'followers' | 'commenters';
}
export type AudienceAgeRanges = '18-24' | '25-34' | '35-44' | '45-64' | '65-';

// TODO: get this types more exact. In IQdata api docs you can click the value to expand it!
export interface InfluencerSearchRequestBodyFilter {
    audience_age?: {
        code: AudienceAgeRanges;
        /** default 0.25 */
        weight?: number;
    }[];
    audience_age_range?: AudienceAgeRange;
    audience_brand?: AudienceBrandElement[];
    audience_brand_category?: AudienceBrandElement[];
    audience_gender?: AudienceGenderElement;
    audience_geo?: AudienceGeo[];
    audience_lang?: AudienceLang;
    // audience_race?: AudienceGenderElement; //not using
    audience_relevance?: AudienceRelevance;
    brand?: number[];
    brand_category?: number[];
    engagements?: Engagements;
    /**We round views value in the filter to the nearest thousand (1400 -> 1k; 1500-> 2k). */
    views?: Engagements;
    posts_count?: Engagements;
    reels_plays?: Engagements;
    followers?: Engagements;
    gender?: {
        code: GenderAllCode;
    };
    age?: Age;
    geo?: Geo[];
    lang?: {
        /**You can get a valid language code from our dictionary */
        code: string;
    };
    followers_growth?: SGrowth;
    total_views_growth?: SGrowth;
    total_likes_growth?: SGrowth;
    relevance?: Relevance;
    /** Search phrase within influencer BIO or full name */
    text?: string;
    /** Search phrase within influencer BIO or full name */
    keywords?: string;
    text_tags?: TextTag[];
    engagement_rate?: EngagementRate;
    is_hidden?: boolean;
    is_verified?: boolean;
    /**  Filter by account types, 1 - Regular, 2 - Business, 3 - Creator. For example, to get business or creator accounts pass [2,3] value to this filter. */
    account_type?: number[];
    has_ads?: boolean;
    ads_brands?: number[];
    with_contact?: WithContact[];
    audience_credibility?: number;
    audience_credibility_class?: string[];
    // list?: List[]; // not using this feature
    filter_ids?: string[];
    is_official_artist?: boolean;
    /** Maximum number of days since last post of influencer. >= 30 */
    last_posted?: number;
    has_audience_data?: boolean;
    username?: Username;
    actions?: Action[];
}

interface Action {
    filter: string;
    action: string;
}

type AgeOptionsString = '18' | '25' | '35' | '45' | '65';
interface Age {
    left_number?: AgeOptionsString;
    right_number?: AgeOptionsString;
}
export type GenderBinaryCode = 'MALE' | 'FEMALE';
export type GenderAllCode = 'MALE' | 'FEMALE' | 'KNOWN' | 'UNKNOWN';
interface AudienceGenderElement {
    code: GenderBinaryCode;
    /** default .5 */
    weight?: number;
}
interface AudienceLang {
    code: string;
    /** default .2 */
    weight?: number;
}

export type AudienceAgeRangeLeft = 13 | 18 | 25 | 35 | 45 | 65;
export type AudienceAgeRangeRight = 17 | 24 | 34 | 44 | 64;
export type OperatorCompare = 'lt' | 'lte' | 'gt' | 'gte';
interface AudienceAgeRange {
    left_number?: AudienceAgeRangeLeft;
    right_number?: string;
    /** default .25 */
    weight?: number;
    operator?: OperatorCompare;
}
interface AudienceBrandElement {
    id: number;
    /** default .1 */
    weight?: number;
}
export interface AudienceGeo {
    id: number;
    /** default .05 */
    weight?: number;
}
interface AudienceRelevance {
    /**Has lookalike audience as of specified influencer. For example "@topgear" means "Has audience lookalike audience of @topgear account". Lookalike means that audience follows accounts with the same topic as an audience of specified account. */
    value: string;
}

interface EngagementRate {
    value: number;
    operator: string;
}
/** We round engagements value in the filter: whenever it’s below 500, we round it to the nearest hundred (412 -> 400; 480-> 500); when it’s between 500 and 1000, we round it to the nearest 5,00 (700 -> 500; 800 -> 1000); when it’s over 1k, we rount it to the nearest 1,000 (5400 -> 5k; 5500 -> 6k) */
interface Engagements {
    left_number?: number;
    right_number?: number;
}

interface SGrowth {
    /** Default: "i1month"
Enum: "i1month" "i2months" "i3months" "i4months" "i5months" "i6months" */
    interval?: string;
    value: number;
    operator?: OperatorCompare;
}

/** You can get a valid ID from geos dictionary */
interface Geo {
    id: number;
}

// interface List {
//     id: number;
//     action: string;
// }

/** Filter by topic of influencers posts of by similarity of topic to other influencer. For example "#cars #audi @topgear" means "Writing about #cars and #audi, has similar topic as @topgear account" */
interface Relevance {
    value: string;
    /** default 0.5 */
    weight?: number;
    /* Threshold on relevance distance. You can view distance on search results while searching by relevance. Default: 0.55 */
    threshold?: number;
}

interface TextTag {
    type: string;
    /** Hashtag or mention to search for, without @ or #  */
    value: string;
    action?: string;
}

interface Username {
    value: string;
    operator?: 'prefix' | 'exact';
}
export type IQDataContactType =
    | 'bbm'
    | 'email'
    | 'facebook'
    | 'instagram'
    | 'itunes'
    | 'kakao'
    | 'kik'
    | 'lineid'
    | 'linktree'
    | 'phone'
    | 'pinterest'
    | 'sarahah'
    | 'sayat'
    | 'skype'
    | 'snapchat'
    | 'telegram'
    | 'tiktok'
    | 'tumblr'
    | 'twitchtv'
    | 'twitter'
    | 'viber'
    | 'vk'
    | 'wechat'
    | 'weibo'
    | 'whatsapp'
    | 'youtube';
interface WithContact {
    type: IQDataContactType;
    /**Default: "should"
    Enum: "must" "should" "not"
    Include only (must, should) or exclude (not) influencers from search results. Evaluation: must && must && (should || should) && !not && !not */
    action?: string;
}

interface Paging {
    /** integer (Limit) <= 100 */
    limit: number;
    skip?: number;
}

export interface Countries {
    id: number;
    name: string;
    code: string;
    weight: number;
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
