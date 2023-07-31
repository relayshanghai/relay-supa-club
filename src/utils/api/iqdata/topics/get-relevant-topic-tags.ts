import type { CreatorPlatform } from 'types';
import { headers } from 'src/utils/api/iqdata/constants';
import { apiFetch } from '../api-fetch';
import type { ServerContext } from '..';

export type GetRelevantTopicTagsPayload = {
    query: {
        q: string;
        limit?: number;
        platform?: CreatorPlatform;
    };
};

export type TopicTensorData = {
    tag: string;
    distance: number;
    freq: number;
    tag_cnt: number;
};

type GetRelevantTopicTagsResponse = {
    success: boolean;
    data: TopicTensorData[];
};

const sortByDistance = (tags: TopicTensorData[]) => {
    tags.sort((a: TopicTensorData, b: TopicTensorData) => {
        if (a.distance < b.distance) return -1;
        if (a.distance > b.distance) return 1;
        return 0;
    });
};

export const getRelevantTopicTags = async (payload: GetRelevantTopicTagsPayload, context?: ServerContext) => {
    if (!payload.query.q) {
        throw new Error(`q in payload query is required`);
    }

    payload.query.q = `#${payload.query.q}`;

    const response = await apiFetch<GetRelevantTopicTagsResponse>(
        'https://socapi.icu/v2.0/api/dict/relevant-tags',
        { ...payload, context },
        { headers },
    );

    if (response && response.success === true) {
        sortByDistance(response.data);
    }

    return response;
};
