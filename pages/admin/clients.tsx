import { useSetAtom } from 'jotai';
import Link from 'next/link';
import type { AdminClientsGetResponse } from 'pages/api/admin/clients';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import { nextFetch } from 'src/utils/fetcher';

const columnHeaders = ['Account', 'Campaigns', 'Staff', 'Contact', 'Subscription Status', 'Search'];

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
                company_id: clientId,
                company_name: clientName,
            });
        }
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
                        <tbody className="divide-y divide-gray-100">
                            {data.map((client) => {
                                const ownerProfiles = client.profiles.filter(
                                    (profile) => profile.user_role === 'company_owner',
                                );
                                const contactEmails = ownerProfiles.map((profile) => profile.email);
                                let contactEmailString = '';
                                contactEmails.forEach(
                                    (email, index) =>
                                        (contactEmailString +=
                                            (ownerProfiles[index].first_name + ': ' || '') +
                                            email +
                                            (index !== ownerProfiles.length - 1 ? ', ' : '')),
                                );

                                const dataPoints = [
                                    client.name,
                                    client.campaigns.length,
                                    client.profiles.length,
                                    contactEmailString,
                                    client.subscription_status,
                                    'Search As',
                                ];
                                return (
                                    <tr key={client.id} className=" hover:bg-gray-100">
                                        {dataPoints.map((dataPoint, index) => (
                                            <td
                                                key={columnHeaders[index] + dataPoint}
                                                className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                                            >
                                                {columnHeaders[index] === 'Campaigns' ? (
                                                    <div className="flex items-center justify-center">
                                                        <Link href={`/admin/campaigns/${client.id}`}>
                                                            <Button
                                                                onClick={() =>
                                                                    client.name &&
                                                                    clientRoleDataHandler(client.name, client.id)
                                                                }
                                                            >
                                                                {dataPoint}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                ) : columnHeaders[index] === 'Search' ? (
                                                    <Link href={`/admin/search/${client.id}`}>
                                                        <Button
                                                            onClick={() =>
                                                                client.name &&
                                                                clientRoleDataHandler(client.name, client.id)
                                                            }
                                                        >
                                                            {dataPoint}
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    dataPoint
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default Clients;
