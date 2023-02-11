import { Layout } from 'src/components/layout';
import { AccountPage } from 'src/components/account/account-page';
import { AccountProvider } from 'src/components/account/account-context';

const Page = () => {
    return (
        <Layout>
            <AccountProvider>
                <AccountPage />
            </AccountProvider>
        </Layout>
    );
};

export default Page;
