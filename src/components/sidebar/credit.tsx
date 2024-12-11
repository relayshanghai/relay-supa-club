import { useBalance } from 'src/hooks/use-balance';
import { useUsageV2 } from 'src/hooks/v2/use-usages';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'shadcn/components/ui/skeleton';
import { Progress } from 'shadcn/components/ui/progress';

export const SidebarCredit = () => {
    const { t } = useTranslation();
    const { usages: usagesV2 } = useUsageV2();
    const { balance, loading: balanceLoading } = useBalance();
    const usagesSearch = balanceLoading ? 0 : usagesV2.search - balance.search;
    const usagesProfiles = balanceLoading ? 0 : usagesV2.profile - balance.profile;
    const usagesExports = balanceLoading ? 0 : usagesV2.export - balance.export;
    if (balanceLoading) {
        <section className="flex flex-col gap-6" id="account-search-and-report">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
        </section>;
    }
    return (
        <section className="flex flex-col gap-3" id="account-search-and-report">
            <h3>{t('navbar.creditUsages')}</h3>
            <span>
                {usagesProfiles}/{usagesV2.profile} {t('account.planSection.reportsCount')}
            </span>
            <Progress className="h-2" value={(usagesProfiles / usagesV2.profile) * 100} />
            <span>
                {usagesSearch}/{usagesV2.search} {t('account.planSection.searchesCount')}
            </span>
            <Progress className="h-2" value={(usagesSearch / usagesV2.search) * 100} />
            <span>
                {usagesExports}/{usagesV2.export} {t('account.planSection.exportsCount')}
            </span>
            <Progress className="h-2" value={(usagesExports / usagesV2.export) * 100} />
        </section>
    );
};
