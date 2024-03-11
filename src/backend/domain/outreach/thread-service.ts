import { UseLogger } from "src/backend/integration/logger/decorator";
import { CompanyIdRequired } from "../decorators/company-id";
import type { GetThreadsRequest } from "pages/api/v2/threads/request";
import ThreadRepository from "src/backend/database/thread/thread-repository";
import { RequestContext } from "src/utils/request-context/request-context";
import EmailEngineService from "src/backend/integration/email-engine/email-engine";
import type { ProfileEntity } from "src/backend/database/profile/profile-entity";
import EmailRepository from "src/backend/database/thread/email-repository";
import EmailHelperService from "../email/email-helper-service";
import type { ReplyRequest } from "pages/api/v2/threads/[id]/reply-request";
import { NotFoundError } from "src/utils/error/http-error";

export default class ThreadService {
    static service = new ThreadService();
    static getService () {
        return ThreadService.service;
    }


    @UseLogger()
    @CompanyIdRequired()
    async getAllThread(request: GetThreadsRequest) {
        const companyId = RequestContext.getContext().companyId as string
        const threadIds: string[] = []
        /**
         * move this search term to database
         * currently we dont support it because we dont store email content in our database
         */
        if (request.searchTerm) {
            const profile = RequestContext.getContext().profile as ProfileEntity
            const responses = await EmailEngineService.getService().getAllEmailsByAccountId(profile.emailEngineAccountId as string, {
                page: 0,
                search: {},
                documentQuery: {
                    query_string: {
                        query: request.searchTerm,
                    },
                }
            });
            responses.forEach((email) => {
                if(!threadIds.includes(email.threadId)){
                    threadIds.push(email.threadId)
                }
            })
        }
        const data = await ThreadRepository.getRepository().getAll(companyId, {
            ...request,
            threadIds
        }, {
            contacts: {
                emailContact: true
            },
            sequenceInfluencer: {
                sequence: true,
                influencerSocialProfile: true
            },
            
        });
        return data;
    }

    @UseLogger()
    @CompanyIdRequired()
    async getThread(id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const thread = await ThreadRepository.getRepository().findOne({
            where: {
                threadId: id,
                sequenceInfluencer: {
                    company: {
                        id: companyId
                    }   
                }
            },
            relations: {
                sequenceInfluencer: {
                    sequence: true,
                    influencerSocialProfile: true
                },
                contacts: {
                    emailContact: true
                }
            }
        });
        if (!thread) {
            throw new NotFoundError('Thread not found');
        }
        return thread;
    }

    @UseLogger()
    @CompanyIdRequired()
    async getThreadEmail(id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const data = await EmailRepository.getRepository().find({
            where: {
                thread: {
                    threadId: id,
                    sequenceInfluencer: {
                        company: {
                            id: companyId
                        } 
                    }
                }
            },
            order: {
                createdAt: 'ASC'
            }
        });
        return data.map(EmailHelperService.getService().parseMessage);
    }

    @UseLogger()
    @CompanyIdRequired()
    async reply(threadId: string, request: ReplyRequest) {
        const thread = await this.getThread(threadId);
        const profile = RequestContext.getContext().profile as ProfileEntity;
        const emailEngineAccountId = profile.emailEngineAccountId as string;
        await EmailEngineService.getService().sendEmail(emailEngineAccountId, {
            to: request.to.map((contact) => ({
                address: contact.address
            })),
            cc: request.cc.map((contact) => ({ 
                address: contact.address,
                name: contact.name || contact.address
            })),
            reference: {
                message: thread.lastReplyId as string,
                inline: true,
                action: 'reply',
                documentStore: true,
            },
            html: request.content,
        });
    }
}