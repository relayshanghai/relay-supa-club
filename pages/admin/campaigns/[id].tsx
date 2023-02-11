import { useRouter } from 'next/router';
import CampaignsPage from 'src/components/campaigns/campaigns-page';

const Campaigns = () => {
    const { id } = useRouter().query;
    return <CampaignsPage companyId={id?.toString()} />;
};

export default Campaigns;
