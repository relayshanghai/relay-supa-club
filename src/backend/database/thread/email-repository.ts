import { type EntityManager, type EntityTarget, In } from 'typeorm';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { EmailEntity } from './email-entity';
import { RequestContext } from 'src/utils/request-context/request-context';
import type { GetThreadEmailsRequest } from 'pages/api/v2/threads/[id]/emails/request';

@InjectInitializeDatabaseOnAllProps
export default class EmailRepository extends BaseRepository<EmailEntity> {
    static repository = new EmailRepository();
    static getRepository(): EmailRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<EmailRepository>(EmailRepository.name);
            if (contextRepository) {
                return contextRepository as EmailRepository;
            }
            const repository = new EmailRepository(EmailEntity, manager);
            RequestContext.registerRepository(EmailRepository.name, repository);
            return repository;
        }
        return EmailRepository.repository;
    }
    constructor(target: EntityTarget<EmailEntity> = EmailEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async updateByEmailEngineMessageIds(ids: string[], data: Partial<EmailEntity>) {
        return this.update(
            {
                emailEngineMessageId: In(ids),
            },
            data,
        );
    }

    async getAllPerThread(threadId: string, companyId: string, params: GetThreadEmailsRequest) {
        const data = await this.getPaginated(params, {
            where: {
                thread: {
                    threadId,
                    sequenceInfluencer: {
                        company: {
                            id: companyId,
                        },
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        return { ...data, items: data.items.map((email) => email.data) };
    }
}
