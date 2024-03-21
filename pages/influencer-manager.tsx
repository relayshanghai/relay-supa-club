import React from 'react';
import { useTranslation } from 'react-i18next';
import Manager from 'src/components/influencer/manager';
import ManagerDummy from 'src/components/influencer/manager/manager-dummy';
import { Layout } from 'src/components/layout';
import { Banner } from 'src/components/library/banner';
import { useUser } from 'src/hooks/use-user';

const ManagerPage = () => {
    const { profile } = useUser();
    const { t } = useTranslation();
    return (
        <Layout>
            {profile?.email_engine_account_id ? (
                <Manager />
            ) : (
                <>
                    <Banner
                        buttonText={t('banner.button') ?? ''}
                        title={t('banner.outreach.title')}
                        message={t('banner.outreach.descriptionManager')}
                    />
                    <ManagerDummy />
                </>
            )}
        </Layout>
    );
};

export default ManagerPage;
