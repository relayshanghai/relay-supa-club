import { useRouter } from 'next/router';
import SearchPage from 'src/components/search/search-page';

const Campaigns = () => {
    const { id } = useRouter().query;
    return <SearchPage companyId={id?.toString()} />;
};
// TODO: protect route with getServeSideProps https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/183

export default Campaigns;
