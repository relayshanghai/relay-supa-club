import { useRouter } from 'next/router';
import SearchPage from 'src/components/search/search-page';

const Campaigns = () => {
    const { id } = useRouter().query;
    return <SearchPage companyId={id?.toString()} />;
};

export default Campaigns;
