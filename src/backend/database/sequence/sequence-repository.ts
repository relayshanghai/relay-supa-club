import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { ILike, type EntityManager, type EntityTarget } from 'typeorm';
import { SequenceEntity } from './sequence-entity';
import type { ProfileEntity } from '../profile/profile-entity';
import { type GetSequenceRequest } from 'pages/api/v2/outreach/sequences/request';
import type { PaginationParam } from 'types/pagination';
import { DatabaseProvider } from '../provider/database-provider';

type GetSequenceWhereClause = {
    company: {
        id: string;
    };
    name?: any;
};

export type SequenceEntityWithInfluencerCount = SequenceEntity & {
    totalInfluencers: number;
};

export default class SequenceRepository extends BaseRepository<SequenceEntity> {
    static repository = new SequenceRepository(SequenceEntity);
    static getRepository(): SequenceRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceRepository>(SequenceRepository.name);
            if (contextRepository) {
                return contextRepository as SequenceRepository;
            }
            const repository = new SequenceRepository(SequenceEntity, manager);
            RequestContext.registerRepository(SequenceRepository.name, repository);
            return repository;
        }
        return SequenceRepository.repository;
    }
    constructor(target: EntityTarget<SequenceEntity> = SequenceEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async moveManager(originalProfile: ProfileEntity, newProfile: ProfileEntity) {
        return this.update(
            {
                managerFirstName: newProfile.firstName,
                manager: newProfile,
            },
            {
                managerFirstName: originalProfile.firstName,
                manager: originalProfile,
            },
        );
    }

    async getSequences(
        request: GetSequenceRequest & {
            companyId: string;
        },
    ) {
        const { page, size, name, companyId } = request;

        let whereClause: GetSequenceWhereClause = {
            company: {
                id: companyId,
            },
        };

        if (name) {
            whereClause = {
                ...whereClause,
                name: ILike(`%${name}%`),
            };
        }

        const [sequences, totalCount] = await this.createQueryBuilder('sequence')
            .leftJoinAndSelect('sequence.product', 'product')
            .loadRelationCountAndMap('sequence.totalInfluencers', 'sequence.sequenceInfluencers')
            .where(whereClause)
            .orderBy('sequence.createdAt', 'DESC')
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();

        const sequencesWithInfluencerCount = sequences as SequenceEntityWithInfluencerCount[];

        return { sequences: sequencesWithInfluencerCount, totalCount };
    }

    async getAllPaginated(companyId: string, param: PaginationParam) {
        await DatabaseProvider.initialize();
        const qb = await this.createQueryBuilder('sequences')
            .addSelect(
                `
            (select count(*) from sequence_influencers where sequence_id = sequences.id)
        `,
                'sequences_numOfInfluencers',
            )
            .leftJoinAndSelect('sequences.product', 'product')
            .where('sequences.company_id = :companyId', { companyId });
        return this.getPaginatedQb(param, qb);
    }
}
