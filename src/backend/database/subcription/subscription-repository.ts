import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { SubscriptionEntity } from './subscription-entity';
import type { EntityManager, EntityTarget } from 'typeorm';
import type Stripe from 'stripe';

type SubscriptionStatus = 'TRIAL' | 'TRIAL_EXPIRED' | 'ACTIVE' | 'PASS_DUE' | 'CANCELLED' | 'UNKNOWN';

@InjectInitializeDatabaseOnAllProps
export default class SubscriptionRepository extends BaseRepository<SubscriptionEntity<Stripe.Subscription>> {
    static repository = new SubscriptionRepository();
    static getRepository(): SubscriptionRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SubscriptionRepository>(SubscriptionRepository.name);
            if (contextRepository) {
                return contextRepository as SubscriptionRepository;
            }
            const repository = new SubscriptionRepository(SubscriptionEntity, manager);
            RequestContext.registerRepository(SubscriptionRepository.name, repository);
            return repository;
        }
        return SubscriptionRepository.repository;
    }
    constructor(target: EntityTarget<SubscriptionEntity> = SubscriptionEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async getStatus(id: string): Promise<SubscriptionStatus> {
        const subscription = await this.findOne({
            where: {
                id,
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const currentTime = new Date();
        const activeAt = subscription.activeAt as Date;
        const cancelledAt = subscription.cancelledAt as Date;
        const pausedAt = subscription.pausedAt as Date;
        if (subscription.activeAt === null && currentTime < cancelledAt) {
            return 'TRIAL';
        } else if (subscription.activeAt === null && currentTime > cancelledAt) {
            return 'TRIAL_EXPIRED';
        } else if (subscription.activeAt !== null && currentTime < pausedAt) {
            return 'ACTIVE';
        } else if (activeAt !== null && currentTime >= pausedAt && cancelledAt === null) {
            return 'PASS_DUE';
        } else if (subscription.activeAt !== null && currentTime >= cancelledAt) {
            return 'CANCELLED';
        } else {
            return 'UNKNOWN';
        }
    }
}
