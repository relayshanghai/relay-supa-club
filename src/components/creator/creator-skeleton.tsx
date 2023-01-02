import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ErrorPopover } from '../common/error-popover';
import SkeletonCreatorBlock from '../common/skeleton-creator';
import SkeletonWithTitle from '../common/skeleton-with-title';
import Skeleton from '../common/skeleton';
import { LoadingPopover } from '../common/loading-popover';

export default function SkeletonLoader({
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
                <Skeleton
                    blockHeight={36}
                    blockWidth={36}
                    className="rounded-full sm:mr-6 mb-6 sm:mb-0"
                />
                <div className="text-center sm:text-left">
                    <Skeleton blockHeight={8} blockWidth={64} />
                    <Skeleton blockHeight={5} blockWidth={24} />
                </div>
            </div>
            <Skeleton blockHeight={8} blockWidth={24} />
            <Skeleton blockHeight={10} blockWidth={24} className="mb-12" />
            <div className="flex flex-col mt-4 space-x-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                    <SkeletonWithTitle blocks={2} blockWidth={32} containerClassName="mb-12" />

                    <SkeletonWithTitle blockHeight={36} />
                </div>
                <div className="w-full lg:w-1/2">
                    <SkeletonCreatorBlock rowLimit={4} />
                </div>
            </div>
        </div>
    );
}
