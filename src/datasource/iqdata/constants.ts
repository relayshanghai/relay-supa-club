export const SearchInfluencersDefault = {
    query: {
        auto_unhide: true,
        platform: 'instagram',
    },
    body: {
        sort: {},
        filter: {
            username: {
                operator: 'prefix',
            },
        },
    },
};

export const ListReportsPayloadDefault = {
    query: {
        platform: 'instagram',
    },
};

export const NewReportPayloadDefault = {
    query: {
        platform: 'instagram',
    },
};

export const FetchReportPayloadDefault = {
    path: {},
    query: {
        fmt: 'json',
    },
};

export const ListUsersPayloadDefault = {
    query: {
        q: '',
        limit: 10,
        platform: 'instagram',
    },
};
