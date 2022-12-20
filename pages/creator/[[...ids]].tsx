import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { Layout } from 'src/modules/layout';
import { headers } from 'src/utils/api/constants';
import { CreatorSearchResult, CreatorSearchResultItem } from 'types';

const Page = ({
    platform,
    user_id,
    creator,
    error
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <Layout>
            <div className="flex flex-col p-6">
                <p>{platform}</p>
                <p>{user_id}</p>
                <p>{creator?.user_profile.username}</p>
                <p>{error}</p>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<{
    platform: string;
    user_id: string;
    creator: CreatorSearchResultItem['account'] | null;
    error: string;
}> = async (context) => {
    const { ids } = context.query;
    const [platform, user_id] = ids as string[];
    const query = {
        paging: {},
        filter: {
            filter_ids: [user_id]
        },
        sort: { field: 'followers', direction: 'desc' },
        audience_source: 'any'
    };
    let creator: CreatorSearchResultItem['account'] | null = null;
    let error = '';
    try {
        const searchRes = await fetch(
            `https://socapi.icu/v2.0/api/search/newv1?platform=${platform}&auto_unhide=1`,
            {
                method: 'post',
                headers,
                body: JSON.stringify(query)
            }
        );
        console.log({ searchRes });
        const searchResJson = (await searchRes.json()) as CreatorSearchResult;
        console.log({ searchResJson });
        creator = searchResJson.accounts[0].account;
        console.log({ creator });
    } catch (error: any) {
        error = error.message;
    }
    return {
        props: {
            platform,
            user_id,
            creator,
            error
        }
    };
};

export default Page;
