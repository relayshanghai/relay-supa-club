import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import CampaignsPage from 'src/components/campaigns/campaigns-page';

const Campaigns = () => {
    const { companyId } = useAtomValue(clientRoleAtom);

    return <CampaignsPage companyId={companyId !== '' ? companyId : undefined} />;
};

export default Campaigns;
