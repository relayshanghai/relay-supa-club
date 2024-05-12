import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { In, type EntityManager, type EntityTarget, Raw } from 'typeorm';
import { InfluencerSocialProfileEntity } from './influencer-social-profile-entity';

@InjectInitializeDatabaseOnAllProps
export class InfluencerSocialProfileRepository extends BaseRepository<InfluencerSocialProfileEntity> {
    static repository: InfluencerSocialProfileRepository = new InfluencerSocialProfileRepository();
    static getRepository(): InfluencerSocialProfileRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<InfluencerSocialProfileRepository>(
                InfluencerSocialProfileRepository.name,
            );
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new InfluencerSocialProfileRepository(InfluencerSocialProfileEntity, manager);
            RequestContext.registerRepository(InfluencerSocialProfileRepository.name, repository);
            return repository;
        }
        return InfluencerSocialProfileRepository.repository;
    }
    constructor(
        target: EntityTarget<InfluencerSocialProfileEntity> = InfluencerSocialProfileEntity,
        manager?: EntityManager,
    ) {
        super(target, manager);
    }

    getAllByIds(ids: string[]): Promise<InfluencerSocialProfileEntity[]> {
        return this.find({
            where: {
                id: In(ids),
            },
            relations: ['influencer'],
        });
    }

    getUnexistedInfluencersOnly(sequenceId: string, ids: string[]) {
        return this.find({
            where: {
                id: Raw(
                    (columnAlias) => `
                    ${columnAlias} NOT IN (SELECT influencer_social_profile_id FROM sequence_influencers WHERE sequence_id = :p1)
                    AND ${columnAlias} IN (${ids.map((_id, index) => `:p${index + 2}`).join(',')})
                `,
                    {
                        p1: sequenceId,
                        ...ids.reduce(
                            (acc, id, index) => ({
                                ...acc,
                                [`p${index + 2}`]: id,
                            }),
                            {},
                        ),
                    },
                ),
            },
        });
    }
}
