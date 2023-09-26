import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ErrorPopover } from '../common/error-popover';
import SkeletonCreatorBlock from '../common/skeleton-creator';
import SkeletonWithTitle from '../common/skeleton-with-title';
import Skeleton from '../common/skeleton';
import { LoadingPopover } from '../common/loading-popover';
import { usageErrors } from 'src/errors/usages';

export default function CreatorSkeleton({
    error,
    errorMessage,
    loading,
}: {
    error: boolean;
    errorMessage: any;
    loading: boolean;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const usageErrorsValues = Object.values(usageErrors).map((item) => t(item));

    return (
        <div className="p-6">
            <div className="relative">
                {loading && <LoadingPopover text={t('creators.show.generateReport')} />}
                {error && (
                    <>
                        {usageErrorsValues.includes(errorMessage) ? (
                            <ErrorPopover
                                errorMessage={errorMessage}
                                buttonText={t('account.subscription.upgradeSubscription') || ''}
                                buttonAction={() => router.push('/account')}
                            />
                        ) : (
                            <ErrorPopover
                                errorMessage={errorMessage}
                                buttonText={t('website.back') || ''}
                                buttonAction={() => router.back()}
                            />
                        )}
                    </>
                )}
            </div>
            {loading && (
                <>
                    <div className="mb-2 flex flex-col items-center lg:flex-row">
                        <Skeleton className="mb-6 h-32 w-32 !rounded-full sm:mb-0 sm:mr-6" />
                        <div className="text-center sm:text-left">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="mb-12 h-10 w-32" />
                    <div className="mt-4 flex flex-col space-x-6 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <SkeletonWithTitle blocks={2} containerClassName="mb-12" className="h-24 w-32" />

                            <SkeletonWithTitle className="h-32 w-full" />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <SkeletonCreatorBlock rowLimit={4} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
