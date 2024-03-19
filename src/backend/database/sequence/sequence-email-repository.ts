import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { SequenceEmailEntity } from './sequence-email-entity';
import { type EntityManager, type EntityTarget } from 'typeorm';

export default class SequenceEmailRepository extends BaseRepository<SequenceEmailEntity> {
    static repository = new SequenceEmailRepository();
    static getRepository(): SequenceEmailRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceEmailRepository>(
                SequenceEmailRepository.name,
            );
            if (contextRepository) {
                return contextRepository as SequenceEmailRepository;
            }
            const repository = new SequenceEmailRepository(SequenceEmailEntity, manager);
            RequestContext.registerRepository(SequenceEmailRepository.name, repository);
            return repository;
        }
        return SequenceEmailRepository.repository;
    }
    constructor(target: EntityTarget<SequenceEmailEntity> = SequenceEmailEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async getSequenceByInfluencerId(influencerId: string) {
        return this.find({
            where: {
                sequenceInfluencer: { id: influencerId },
            },
        });
    }
}
