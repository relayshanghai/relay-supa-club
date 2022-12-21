import { useRouter } from 'next/router';
import { CreatorPage } from 'src/components/creator/creator-page';
import { Layout } from 'src/modules/layout';

const Page = () => {
    const { ids } = useRouter().query;

    return (
        <Layout>
            {!ids || typeof ids !== 'object' ? (
                <p>Invalid URL</p>
            ) : (
                <CreatorPage platform={ids[0] as any} user_id={ids[1]} />
            )}
        </Layout>
    );
};

export default Page;
