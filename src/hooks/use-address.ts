import { apiFetch } from 'src/utils/api/api-fetch';
import useSWR from 'swr';
import type { Address } from 'src/backend/database/addresses';
import type { AddressGetQuery } from 'pages/api/addresses';

export const useAddress = (influencerSocialProfileId?: string | null) => {
    const { data: address, error: addressError } = useSWR([influencerSocialProfileId], async () => {
        if (!influencerSocialProfileId) {
            return null;
        }
        const res = await apiFetch<Address, AddressGetQuery>('/api/addresses', {
            query: {
                id: influencerSocialProfileId,
            },
        });
        return res.content;
    });

    return {
        address,
        addressError,
    };
};
