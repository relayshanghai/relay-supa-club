import { NotFoundError, UnprocessableEntityError } from 'src/utils/error/http-error';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { BalanceEntity, type BalanceType } from './balance-entity';
import { RequestContext } from 'src/utils/request-context/request-context';
import type { EntityManager, EntityTarget } from 'typeorm';
import { type Nullable } from 'types/nullable';
import { UseLogger } from 'src/backend/integration/logger/decorator';

@InjectInitializeDatabaseOnAllProps
export default class BalanceRepository extends BaseRepository<BalanceEntity> {
    static repository: BalanceRepository = new BalanceRepository();

    static getRepository(): BalanceRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<BalanceRepository>(BalanceRepository.name);
            if (contextRepository) {
                return contextRepository as BalanceRepository;
            }
            const repository = new BalanceRepository(BalanceEntity, manager);
            RequestContext.registerRepository(BalanceRepository.name, repository);
            return repository;
        }
        return BalanceRepository.repository;
    }
    constructor(target: EntityTarget<BalanceEntity> = BalanceEntity, manager?: EntityManager) {
        super(target, manager);
    }
    @UseLogger()
    async deduct(companyId: string, type: BalanceType, amount: number) {
        await this.manager.transaction(async (manager) => {
            const balance = await manager.query(
                `select amount from balances where company_id = $1 and balance_type = $2`,
                [companyId, type],
            );
            if (!balance || balance?.length === 0) {
                throw new NotFoundError('Balance not found');
            }
            if (balance[0]?.amount < amount) {
                throw new UnprocessableEntityError('insuficentbalance');
            }
            await this.query(
                `
                UPDATE balances SET amount = amount - $1
                WHERE company_id = $2 AND balance_type = $3`,
                [amount, companyId, type],
            );
        });
    }
    async resetBalance(companyId: string, type: BalanceType, amount: number, nextRenewAt: Nullable<Date> = null) {
        await this.manager.transaction(async (manager) => {
            await manager.query(
                `
            UPDATE balances SET 
                amount = $1,
                next_renew_at = $2 
            WHERE company_id = $3 AND balance_type = $4`,
                [amount, nextRenewAt, companyId, type],
            );
        });
    }
    async resetBySchedule() {
        await this.manager.query(`
            UPDATE balances b 
            SET 
                amount = COALESCE(c.profiles_limit, c.trial_profiles_limit)::bigint,
                next_renew_at = next_renew_at + interval '1 month'
            FROM companies c
            WHERE 
            b.company_id = c.id AND "b"."balance_type" = 'profile' AND 
            b.next_renew_at <= now() AND b.next_renew_at IS NOT NULL
        `);
        await this.manager.query(`
            UPDATE balances b 
            SET 
                amount = COALESCE(c.searches_limit, c.trial_searches_limit)::bigint,
                next_renew_at = next_renew_at + interval '1 month'
            FROM companies c
            WHERE 
            b.company_id = c.id AND "b"."balance_type" = 'search' AND 
            b.next_renew_at <= now() AND b.next_renew_at IS NOT NULL
        `);
    }
}
