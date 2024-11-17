import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { PaymentTransactionEntity } from './payment-transaction-entity';

@InjectInitializeDatabaseOnAllProps
export default class PaymentTransactionRepository extends BaseRepository<PaymentTransactionEntity> {
    static readonly repository = new PaymentTransactionRepository();
    static getRepository(): PaymentTransactionRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<PaymentTransactionRepository>(
                PaymentTransactionRepository.name,
            );
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new PaymentTransactionRepository(PaymentTransactionEntity, manager);
            RequestContext.registerRepository(PaymentTransactionRepository.name, repository);
            return repository;
        }
        return PaymentTransactionRepository.repository;
    }
    constructor(target: EntityTarget<PaymentTransactionEntity> = PaymentTransactionEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
