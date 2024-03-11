import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ThreadEntity } from './thread-entity';
import { In, IsNull, Like, Not, type EntityManager, type EntityTarget, type FindOptionsRelations, type FindOptionsWhere } from 'typeorm';
import type { GetThreadsRequest } from 'pages/api/v2/threads/request';
import type { SequenceInfluencerEntity } from '../sequence/sequence-influencer-entity';

@InjectInitializeDatabaseOnAllProps
export default class ThreadRepository extends BaseRepository<ThreadEntity> {
    static repository = new ThreadRepository();
    static getRepository(): ThreadRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ThreadRepository>(ThreadRepository.name);
            if (contextRepository) {
                return contextRepository as ThreadRepository;
            }
            const repository = new ThreadRepository(ThreadEntity, manager);
            RequestContext.registerRepository(ThreadRepository.name, repository);
            return repository;
        }
        return ThreadRepository.repository;
    }
    constructor(target: EntityTarget<ThreadEntity> = ThreadEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async getAll(companyId: string, param: GetThreadsRequest & {
        threadIds?: string[]
    }, relations?: FindOptionsRelations<ThreadEntity>) {
        let where: FindOptionsWhere<ThreadEntity> = {
            lastReplyId: Not(IsNull()),
            lastReplyDate: Not(IsNull())
        } 
        let whereSequenceInfluencer: FindOptionsWhere<SequenceInfluencerEntity> = {
            company: {
                id: companyId
            }
        }
        if(param.funnelStatus) {
            whereSequenceInfluencer = {
                ...whereSequenceInfluencer,     
                funnelStatus: In(param.funnelStatus)
            }
        }
        if(param.sequences) {
            whereSequenceInfluencer = {
                ...whereSequenceInfluencer,
                sequence: {
                    id: In(param.sequences)
                }
            }
        }
        // to do: needs to change to searchTerm, currently we dont support search term since we dont store email content as plain text but json instead
        if(param.threadIds && param.threadIds.length) {
            where = {
                ...where,
                threadId: In(param.threadIds)
            }
        }
        where.sequenceInfluencer = whereSequenceInfluencer
        const data = await this.getPaginated(param, {
            where,
            relations,
            order: {
                lastReplyDate: 'DESC'
            }
        })
        return data
    }
}
