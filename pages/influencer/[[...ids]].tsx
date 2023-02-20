import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ErrorPopover } from 'src/components/common/error-popover';
import { CreatorPage } from 'src/components/creator/creator-page';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';

const Page = () => {
    const router = useRouter();
    const { ids } = router.query;
    const { isReady } = router;
    const { t } = useTranslation();

    return (
        <Layout>
            {isReady ? (
                !ids || !Array.isArray(ids) || ids?.length < 2 ? (
                    <div className="relative p-6">
                        <ErrorPopover
                            errorMessage={'Invalid creator id or platform'}
                            buttonText={t('website.back') || ''}
                            buttonAction={() => router.back()}
                        />
                    </div>
                ) : (
                    <CreatorPage platform={ids[0] as any} creator_id={ids[1]} />
                )
            ) : (
                <Spinner />
            )}
        </Layout>
    );
};

export default Page;
