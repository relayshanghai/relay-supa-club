import React from 'react';
import Manager from 'src/components/influencer/manager';
import ManagerDummy from 'src/components/influencer/manager/manager-dummy';
import { Layout } from 'src/components/layout';
import { useUser } from 'src/hooks/use-user';

const ManagerPage = () => {
    const { profile } = useUser();
    return <Layout>{profile?.email_engine_account_id ? <Manager /> : <ManagerDummy />}</Layout>;
};

export default ManagerPage;
