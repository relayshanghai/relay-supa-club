import Link from 'next/link';
import React from 'react';
import { Button } from '../button';
import type { AdminClientsGetResponse, ClientInfo } from 'pages/api/admin/clients';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';

type ClientsRowProps = {
    data: AdminClientsGetResponse;
    columnHeaders: string[];
    clientRoleDataHandler: (clientName: string, clientId: string) => void;
    resetClientRoleData: () => void;
};

const ClientsRow = ({ data, columnHeaders, clientRoleDataHandler, resetClientRoleData }: ClientsRowProps) => {
    const { companyId } = useAtomValue(clientRoleAtom);

    const onManageClick = async (client: ClientInfo) => {
        if (companyId !== '' && companyId === client.id) {
            client.name && resetClientRoleData();
        } else {
            client.name && clientRoleDataHandler(client.name, client.id);
        }
        // reset cache
        const { deleteDB } = await import('idb');
        await deleteDB('app-cache');
    };

    return (
        <tbody className="divide-y divide-gray-100">
            {data.map((client) => {
                const ownerProfiles = client.profiles.filter((profile) => profile.user_role === 'company_owner');
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
                    client.hasOutreach,
                    client.profiles.length,
                    contactEmailString,
                    client.subscription_status,
                    companyId !== '' && companyId === client.id ? 'Close' : 'Manage',
                ];

                return (
                    <tr key={client.id} className=" hover:bg-gray-100">
                        {dataPoints.map((dataPoint, index) => (
                            <td
                                key={columnHeaders[index] + dataPoint}
                                className="max-w-[100px] overflow-scroll whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                            >
                                {columnHeaders[index] === 'Manage' ? (
                                    <Link
                                        href={
                                            companyId !== '' && companyId === client.id
                                                ? '/admin/clients'
                                                : '/dashboard'
                                        }
                                    >
                                        <Button onClick={() => onManageClick(client)}>{dataPoint}</Button>
                                    </Link>
                                ) : (
                                    dataPoint?.toString()
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default ClientsRow;
