/** this info is available from both the search and reports endpoints */
export interface CreatorUserProfile {
    user_id?: string;
    fullname?: string;
    username?: string;
    handle?: string;
    picture?: string;
    url?: string;
}

export * from './creator-report';
export * from './creator-reports-metadata';
export * from './creator-search-result';
