import SearchPage from 'src/components/search/search-page';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { useAtomValue } from 'jotai';

const Campaigns = () => {
    const clientRoleData = useAtomValue(clientRoleAtom);

    return <SearchPage companyId={clientRoleData.company_name} />;
};

export default Campaigns;
