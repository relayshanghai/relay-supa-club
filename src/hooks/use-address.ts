import { apiFetch } from 'src/utils/api/api-fetch';
import useSWR from 'swr';
import type { Address } from 'src/backend/database/addresses';
import type { AddressGetQuery } from 'pages/api/addresses';

export const useAddress = (addressId?: string | null) => {
    const { data: address, error: addressError } = useSWR([addressId], async () => {
        if (!addressId) {
            return null;
        }
        const res = await apiFetch<Address, AddressGetQuery>('/api/addresses', {
            query: {
                id: addressId,
            },
        });
        return res.content;
    });

    return {
        address,
        addressError,
    };
};
