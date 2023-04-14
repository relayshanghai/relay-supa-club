import type { IQDataDriver } from './drivers/iqdata';

export enum SocialPlatforms {
    instagram = 'instagram',
    youtube = 'youtube',
    tiktok = 'tiktok',
}

export type SocialPlatformID = [string, SocialPlatforms];

export type DataSourceFilters = {
    platform: keyof typeof SocialPlatforms;
};

export type DataSourceDrivers = IQDataDriver;

/** Contract for data sources */
export interface DataSourceInterface<T extends DataSourceDrivers> {
    /**
     * Get the name of the data-source
     */
    getSourceName(): string;

    /**
     * Get the influencer based on the identifier provided
     */
    getInfluencer(
        id: Parameters<T['getInfluencer']>[0],
    ): Promise<ReturnType<T['getInfluencer']>> | ReturnType<T['getInfluencer']>;

    /**
     * Search for influencers using the query provided
     */
    searchInfluencers(
        query: Parameters<T['searchInfluencers']>[0],
        filters: Parameters<T['searchInfluencers']>[1],
    ): Promise<ReturnType<T['searchInfluencers']>> | ReturnType<T['searchInfluencers']>;
}
