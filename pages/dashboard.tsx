import { Layout } from 'src/components/layout';
import { Search } from 'src/modules/search';

const Page = () => {
    return (
        <Layout>
            <div className="flex flex-col p-6">
                <Search />
            </div>
        </Layout>
    );
};

export default Page;
