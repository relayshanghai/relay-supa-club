import SearchPage from 'src/components/search/search-page';
import { clientRoleAtom } from 'atoms/clientRoleAtom';
import { useAtomValue } from 'jotai';

const Campaigns = () => {
    const clientRoleData = useAtomValue(clientRoleAtom);

    return <SearchPage companyId={clientRoleData.company_id} />;
};

export default Campaigns;
