import { BalanceType } from 'src/backend/database/balance/balance-entity';
import { UsageRepository } from 'src/backend/database/usages/repository';
import { RequestContext } from 'src/utils/request-context/request-context';

export class UsageService {
    static service = new UsageService();
    static getService = () => UsageService.service;
    async recordUsage(itemId: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const profile = RequestContext.getContext().profile;
        await UsageRepository.getRepository().save({
            company: {
                id: companyId,
            },
            itemId,
            type: BalanceType.EXPORT,
            profile,
        });
    }
}
