import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { SequenceInfluencerEntity } from './sequence-influencer-entity';
import { type EntityManager, type EntityTarget, In } from 'typeorm';
import { type GetInfluencersRequest } from 'pages/api/v2/outreach/sequences/[sequenceId]/requests';
export const SEQUENCE_INFLUENCER_SOCIAL_NUMBER = process.env.SEQUENCE_INFLUENCER_SOCIAL_NUMBER || 60;
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

    async getIdsForSyncReport() {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const influencers: { id: string }[] = await this.query(
            `select id from sequence_influencers where 
        schedule_status <> 'processing' AND
        (
            (
                (email IS NULL OR email = '') AND social_profile_last_fetched IS NULL
            ) OR social_profile_last_fetched <= $1 
        ) limit ${SEQUENCE_INFLUENCER_SOCIAL_NUMBER}`,
            [last30Days],
        );
        return influencers.map((influencer) => influencer.id);
    }
}
