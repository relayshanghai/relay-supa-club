import { useAtom } from 'jotai';
import React from 'react';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const ClientRoleWarning = () => {
    const router = useRouter();
    const [clientRoleData, setClientRoleData] = useAtom(clientRoleAtom);

    return (
        <div
            className={`absolute right-36 top-5 z-50 flex animate-pulse gap-2 break-all rounded-md bg-red-400 p-2 text-white ${
                clientRoleData.companyId?.length === 0 && 'hidden'
            }`}
        >
            You are acting on behalf of company: {clientRoleData.companyName}
            <XCircleIcon
                className="w-7 cursor-pointer md:w-5"
                onClick={() => {
                    setClientRoleData({
                        companyId: '',
                        companyName: '',
                        emailEngineAccountId: '',
                        sequenceSendEmail: '',
                    });
                    router.push('/admin/clients');
                }}
            />
        </div>
    );
};

export default ClientRoleWarning;
