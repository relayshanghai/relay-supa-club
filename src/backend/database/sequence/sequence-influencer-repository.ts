import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { SequenceInfluencerEntity } from './sequence-influencer-entity';
import { type EntityManager, type EntityTarget, In } from 'typeorm';
import { type GetInfluencersRequest } from 'pages/api/v2/outreach/sequences/[sequenceId]/requests';
export const SEQUENCE_INFLUENCER_SOCIAL_NUMBER = process.env.SEQUENCE_INFLUENCER_SOCIAL_NUMBER || 60;
// start schedule release date, older data will not be fetched
export const SCHEDULE_FETCH_START_DATE = new Date('2024-04-01T00:00:00.000Z');
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
            `select distinct(iqdata_id), id from sequence_influencers where
        created_at > $1 AND 
        funnel_status = 'To Contact' AND
        schedule_status = 'pending' AND
        (
            (
                (email IS NULL OR email = '') AND social_profile_last_fetched IS NULL
            )
        ) limit ${SEQUENCE_INFLUENCER_SOCIAL_NUMBER}`,
            [SCHEDULE_FETCH_START_DATE],
        );
        return influencers.map((influencer) => influencer.id);
    }
}
