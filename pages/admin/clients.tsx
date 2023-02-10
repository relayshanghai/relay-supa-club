import { AdminClientsGetResponse } from 'pages/api/admin/clients';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from 'src/components/icons';
import { Layout } from 'src/modules/layout';
import { nextFetch } from 'src/utils/fetcher';

const columnHeaders = ['Account', 'Campaigns', 'Staff', 'Contact', 'Subscription Status'];

const Clients = () => {
    const [data, setData] = useState<AdminClientsGetResponse>([]);
    const [loading, setLoading] = useState<boolean>(false);
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

    return (
        <Layout>
            <div className="p-6">
                {loading ? (
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    <table className="bg-white  divide-y divide-gray-200 overflow-y-visible w-full">
                        <thead>
                            <tr>
                                {columnHeaders.map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm text-gray-600 tracking-wider min-w-fit "
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((client) => {
                                const ownerProfiles = client.profiles.filter(
                                    (profile) => profile.role === 'company_owner',
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
                                ];
                                return (
                                    <tr key={client.id}>
                                        {dataPoints.map((dataPoint, index) => (
                                            <td
                                                key={columnHeaders[index] + dataPoint}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {dataPoint}
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
