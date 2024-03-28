import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { SequenceInfluencerEntity } from './sequence-influencer-entity';
import { type EntityManager, type EntityTarget, In } from 'typeorm';
import { type GetInfluencersRequest } from 'pages/api/v2/outreach/sequences/[sequenceId]/requests';

export default class SequenceInfluencerRepository extends BaseRepository<SequenceInfluencerEntity> {
    static repository = new SequenceInfluencerRepository();
    static getRepository(): SequenceInfluencerRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceInfluencerRepository>(
                SequenceInfluencerRepository.name,
            );
            if (contextRepository) {
                return contextRepository as SequenceInfluencerRepository;
            }
            const repository = new SequenceInfluencerRepository(SequenceInfluencerEntity, manager);
            RequestContext.registerRepository(SequenceInfluencerRepository.name, repository);
            return repository;
        }
        return SequenceInfluencerRepository.repository;
    }
    constructor(target: EntityTarget<SequenceInfluencerEntity> = SequenceInfluencerEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async getSequenceInfluencerByEmail(...email: string[]) {
        return this.findOne({
            where: {
                email: In(email),
            },
        });
    }

    async getSequenceInfluencersBySequenceId(request: GetInfluencersRequest & { sequenceId: string }) {
        const { sequenceId, page, size } = request;
        return this.getPaginated(
            { page, size },
            {
                where: {
                    sequence: { id: sequenceId },
                },
                order: {
                    updatedAt: 'DESC',
                },
            },
        );
    }
}
