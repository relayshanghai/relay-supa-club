import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import type { GetThreadsRequest, ReadThreadRequest } from 'pages/api/v2/threads/request';
import ThreadRepository from 'src/backend/database/thread/thread-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import EmailEngineService from 'src/backend/integration/email-engine/email-engine';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import EmailRepository from 'src/backend/database/thread/email-repository';
import type { ReplyRequest } from 'pages/api/v2/threads/[id]/reply-request';
import { NotFoundError } from 'src/utils/error/http-error';
import type { GetThreadResponse } from 'pages/api/v2/threads/response';
import { ThreadStatus } from 'src/backend/database/thread/thread-status';
import { getRelevantTopicTagsByInfluencer } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import type { NextApiRequest, NextApiResponse } from 'next';
import { InfluencerSocialProfileRepository } from 'src/backend/database/influencer/influencer-social-profile-repository';
import { getTopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';
import type { InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { logger } from 'src/backend/integration/logger';
import type { GetThreadEmailsRequest } from 'pages/api/v2/threads/[id]/emails/request';
import { In } from 'typeorm';

export default class ThreadService {
    static service = new ThreadService();
    static getService() {
        return ThreadService.service;
    }

    @UseLogger()
    @CompanyIdRequired()
    async getAllThread(request: GetThreadsRequest): Promise<GetThreadResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const threadIds: string[] = [];
        /**
         * move this search term to database
         * currently we dont support it because we dont store email content in our database
         */
        if (request.searchTerm) {
            const profile = RequestContext.getContext().profile as ProfileEntity;
            const responses = await EmailEngineService.getService().getAllEmailsByAccountId(
                profile.emailEngineAccountId as string,
                {
                    page: 0,
                    search: {},
                    documentQuery: {
                        query_string: {
                            query: request.searchTerm,
                        },
                    },
                },
            );
            if (!responses.length) {
                return {
                    items: [],
                    messageCount: {
                        all: 0,
                        unopened: 0,
                        unreplied: 0,
                    },
                    page: 1,
                    size: 30,
                    totalPages: 1,
                    totalSize: 1,
                };
            }
            responses.forEach((email) => {
                if (!threadIds.includes(email.threadId)) {
                    threadIds.push(email.threadId);
                }
            });
        }
        const data = await ThreadRepository.getRepository().getAll(
            companyId,
            {
                ...request,
                threadIds,
            },
            {
                sequenceInfluencer: true,
            },
        );

        return data;
    }

    @UseLogger()
    @CompanyIdRequired()
    async getThread(id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const thread = await ThreadRepository.getRepository().findOne({
            where: {
                id,
                sequenceInfluencer: {
                    company: {
                        id: companyId,
                    },
                },
            },
            relations: {
                sequenceInfluencer: {
                    sequence: {
                        templateVariables: true,
                    },
                    influencerSocialProfile: true,
                    address: true,
                },
                contacts: {
                    emailContact: true,
                },
            },
        });
        if (!thread) {
            throw new NotFoundError('Thread not found');
        }
        const socialProfile = thread.sequenceInfluencer?.influencerSocialProfile as InfluencerSocialProfileEntity;
        if (!socialProfile.topicsRelevances) {
            let topicTags = socialProfile.topicTags;
            const topicRelevance = socialProfile.topicsRelevances;
            logger.info(`resultnya `, { topicRelevance });
            if (topicRelevance) {
                return thread;
            }
            logger.info(`resultnya `, { topicTags });
            if (!topicTags) {
                const req = RequestContext.getContext().request as NextApiRequest;
                const res = RequestContext.getContext().response as NextApiResponse;
                const { username, platform } = socialProfile;
                const result = await getRelevantTopicTagsByInfluencer(
                    { query: { q: username, limit: 60, platform: platform as any } },
                    { req, res },
                );
                logger.info(`resultnya `, { result });
                if (!result.success) return thread;
                topicTags = result.data;
            }

            const topicRelevances = await getTopicsAndRelevance(topicTags as any);
            await InfluencerSocialProfileRepository.getRepository().update(
                {
                    id: socialProfile.id,
                },
                {
                    topicTags: topicTags,
                    topicsRelevances: topicRelevances,
                },
            );
            socialProfile.topicTags = topicTags;
            socialProfile.topicsRelevances = topicRelevances;
        }
        return thread;
    }

    @UseLogger()
    @CompanyIdRequired()
    async getThreadEmail(id: string, request: GetThreadEmailsRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const data = await EmailRepository.getRepository().getAllPerThread(id, companyId, request);
        return data;
    }

    @UseLogger()
    @CompanyIdRequired()
    async reply(threadId: string, request: ReplyRequest) {
        const thread = await this.getThread(threadId);
        const profile = RequestContext.getContext().profile as ProfileEntity;
        const emailEngineAccountId = profile.emailEngineAccountId as string;
        await EmailEngineService.getService().sendEmail(emailEngineAccountId, {
            to: request.to.map((contact) => ({
                address: contact.address,
            })),
            cc: request.cc.map((contact) => ({
                address: contact.address,
                name: contact.name || contact.address,
            })),
            reference: {
                message: thread.lastReplyId as string,
                inline: true,
                action: 'reply',
                documentStore: true,
            },
            html: request.content,
        });
        await ThreadRepository.getRepository().update(
            {
                threadId,
            },
            {
                threadStatus: ThreadStatus.REPLIED,
            },
        );
    }

    @UseLogger()
    @CompanyIdRequired()
    async readThreadIds(request: ReadThreadRequest) {
        await ThreadRepository.getRepository().update(
            { id: In(request.ids), threadStatus: ThreadStatus.UNOPENED },
            {
                threadStatus: ThreadStatus.REPLIED,
            },
        );
    }
}
