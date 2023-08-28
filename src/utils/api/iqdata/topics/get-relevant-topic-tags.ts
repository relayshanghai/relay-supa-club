import type { CreatorPlatform } from 'types';
import type { ServerContext } from '..';
import { apiFetch } from '../api-fetch';
import { RelayError } from 'src/utils/api-handler';
import { limiter } from 'src/utils/limiter';

export type GetRelevantTopicTagsParams = {
    limit?: number;
    platform?: CreatorPlatform;
};

export type GetRelevantTopicTagsPayload = {
    query: GetRelevantTopicTagsParams & {
        q: string;
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
        throw new RelayError(`q in payload query is required`);
    }

    payload.query.q = `#${payload.query.q}`;

    const response = await apiFetch<GetRelevantTopicTagsResponse>('/dict/relevant-tags', { ...payload, context });

    if (response.content.success === true) {
        sortByDistance(response.content.data);
    } else {
        throw new RelayError('Error fetching relevant topic tags');
    }

    return response.content;
};

export const getBulkRelevantTopicTags = async (
    topics: string[],
    params: GetRelevantTopicTagsParams,
): Promise<string[]> => {
    const relevantTopicTagsPromises = topics.map((topic) =>
        limiter.schedule(() => getRelevantTopicTags({ query: { q: topic, ...params } })),
    );

    const relevantTopicTagsResult = await Promise.all(relevantTopicTagsPromises);

    return relevantTopicTagsResult
        .map((result) => result.data)
        .flat()
        .map((topic) => topic.tag.replace('#', ''))
        .filter((topic, index, self) => self.indexOf(topic) === index);
};
