import { useRouter } from 'next/router';
import CampaignsPage from 'src/components/campaigns/campaigns-page';

const Campaigns = () => {
    const { id } = useRouter().query;
    return <CampaignsPage companyId={id?.toString()} />;
};
// TODO: protect route with getServeSideProps https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/183
export default Campaigns;
