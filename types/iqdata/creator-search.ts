import type { Platforms } from './platform';

export type CreatorDictRequest = {
    username: string;
    platform: Platforms;
    type: 'search' | 'topic-tags';
    limit: number;
};
