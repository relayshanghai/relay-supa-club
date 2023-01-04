import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ErrorPopover } from '../common/error-popover';
import SkeletonCreatorBlock from '../common/skeleton-creator';
import SkeletonWithTitle from '../common/skeleton-with-title';
import Skeleton from '../common/skeleton';
import { LoadingPopover } from '../common/loading-popover';

export default function CreatorSkeleton({
    error,
    errorMessage
}: {
    error: boolean;
    errorMessage: any;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <div className="p-6">
            <div className="relative">
                {!error && <LoadingPopover text={t('creators.show.generateReport')} />}
                {error && (
                    <ErrorPopover
                        errorMessage={errorMessage}
                        buttonText={t('website.back') || ''}
                        buttonAction={() => router.back()}
                    />
                )}
            </div>
            <div className="flex flex-col lg:flex-row items-center mb-2">
                <Skeleton className="h-32 w-32 !rounded-full sm:mr-6 mb-6 sm:mb-0" />
                <div className="text-center sm:text-left">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-32 mb-12" />
            <div className="flex flex-col mt-4 space-x-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                    <SkeletonWithTitle
                        blocks={2}
                        containerClassName="mb-12"
                        className="h-24 w-32"
                    />

                    <SkeletonWithTitle className="h-32 w-full" />
                </div>
                <div className="w-full lg:w-1/2">
                    <SkeletonCreatorBlock rowLimit={4} />
                </div>
            </div>
        </div>
    );
}
