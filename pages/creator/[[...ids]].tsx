import { useRouter } from 'next/router';
import { Layout } from 'src/modules/layout';
import { Search } from 'src/modules/search';

const Page = () => {
    const router = useRouter();
    const { ids } = router.query;
    const [platform, id] = ids as string[];
    return (
        <Layout>
            <div className="flex flex-col p-6">
                <p>{platform}</p>
                <p>{id}</p>
            </div>
        </Layout>
    );
};

export default Page;
