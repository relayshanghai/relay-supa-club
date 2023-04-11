import SearchPage from 'src/components/search/search-page';
import { clientRoleAtom } from 'src/atoms/clientRoleAtom';
import { useAtomValue } from 'jotai';

const AdminSearch = () => {
    const clientRoleData = useAtomValue(clientRoleAtom);

    return <SearchPage companyId={clientRoleData.company_id} />;
};

export default AdminSearch;
