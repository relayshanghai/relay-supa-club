export type SupportedPlatforms = 'instagram' | 'youtube' | 'tiktok';

export type SearchInfluencersPayload = {
    query?: {
        auto_unhide: boolean;
        platform: SupportedPlatforms;
    };
    body?: {
        sort?: {
            field: string;
        };
        filter?: {
            keywords?: string;
            username?: {
                value: string;
                operator: 'prefix' | 'exact';
            };
        };
    };
};

export type ListReportsPayload = {
    query?: {
        url: string;
        platform: SupportedPlatforms;
    };
};

export type NewReportPayload = {
    query?: {
        url: string;
        platform: SupportedPlatforms;
        dry_run: boolean;
    };
};

export type FetchReportPayload = {
    path?: {
        report_id: string;
    };
    query?: {
        fmt: 'pdf' | 'json';
    };
};

export type DictionaryType = 'lookalike' | 'topic-tags' | 'search';

export type ListUsersPayload = {
    query?: {
        q: string;
        limit: number;
        type: DictionaryType;
        platform: SupportedPlatforms;
    };
};

export type ApiPayload = {
    path?: {
        [key: string]: any;
    };
    query?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    };
};

export type ApiResponse = {
    [key: string]: any;
};
