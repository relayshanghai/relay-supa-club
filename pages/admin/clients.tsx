import { useSetAtom } from 'jotai';
import type { AdminClientsGetResponse } from 'pages/api/admin/clients';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import ClientsRow from 'src/components/admin/ClientsRow';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { nextFetch } from 'src/utils/fetcher';

const columnHeaders = ['Account', 'Campaigns', 'Staff', 'Contact', 'Subscription Status', 'Manage'];

const Clients = () => {
    const [data, setData] = useState<AdminClientsGetResponse>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const setClientRoleData = useSetAtom(clientRoleAtom);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await nextFetch<AdminClientsGetResponse>('admin/clients');
                setData(res);
            } catch (error: any) {
                toast.error(error.message || 'Something went wrong');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const clientRoleDataHandler = (clientName: string, clientId: string) => {
        if (clientName && clientId) {
            setClientRoleData({
                companyId: clientId,
                companyName: clientName,
            });
        }
    };

    const resetClientRoleData = () => {
        setClientRoleData({
            companyId: '',
            companyName: '',
        });
    };

    return (
        <Layout>
            <div className="p-6">
                {loading ? (
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    <table className="w-full  divide-y divide-gray-200 overflow-y-visible bg-white">
                        <thead>
                            <tr>
                                {columnHeaders.map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="min-w-fit px-6 py-3 text-left text-sm tracking-wider text-gray-600 "
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <ClientsRow
                            clientRoleDataHandler={clientRoleDataHandler}
                            data={data}
                            columnHeaders={columnHeaders}
                            resetClientRoleData={resetClientRoleData}
                        />
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default Clients;
