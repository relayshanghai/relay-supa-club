import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from 'src/modules/layout';
import { headers } from 'src/utils/api/constants';
import { CreatorSearchResult, CreatorSearchAccount } from 'types';

const Page = () => {
    const { ids } = useRouter().query;
    const [platform, user_id] = ids as string[];

    useEffect(() => {
        // check if report exists
    });

    return (
        <Layout>
            <div className="flex flex-col p-6">
                <p>{platform}</p>
                <p>{user_id}</p>
                {/* <p>{creator?.user_profile.username}</p>
                <p>{error}</p> */}
            </div>
        </Layout>
    );
};

export default Page;
