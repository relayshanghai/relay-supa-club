import { apiFetch } from 'src/utils/api/api-fetch';
import useSWR from 'swr';
import type { Address } from 'src/backend/database/addresses';
import type { AddressGetQuery, AddressesPostRequestBody, AddressesPostRequestResponse } from 'pages/api/addresses';
import type {
    SequenceInfluencersPutRequestResponse,
    SequenceInfluencersPutRequestBody,
} from 'pages/api/sequence-influencers';
import { serverLogger } from 'src/utils/logger-server';
import type { InfluencerOutreachData } from 'src/utils/outreach/types';
import { useEffect } from 'react';
import type { ThreadData } from 'pages/component-previews/inbox';

const createAddressIfMissing = async (
    threadData: ThreadData[],
    optimisticUpdateSequenceInfluencer: (
        currentData: ThreadData[],
        newSequenceInfluencerData: SequenceInfluencersPutRequestBody,
    ) => ThreadData[],
    influencer?: InfluencerOutreachData | null,
) => {
    // influencer exists and is populated (has email) but is missing an address
    if (influencer?.email && !influencer.address_id) {
        const { real_full_name, name, username, influencer_social_profile_id } = influencer;
        try {
            const newAddress = await apiFetch<AddressesPostRequestResponse, AddressesPostRequestBody>(
                '/api/addresses',
                {
                    name: real_full_name || name || username || '',
                    country: '',
                    state: '',
                    city: '',
                    postal_code: '',
                    address_line_1: '',
                    influencer_social_profile_id,
                },
                { method: 'POST' },
            );
            if (newAddress.content.id) {
                const update = { id: influencer.id, address_id: newAddress.content.id };
                await apiFetch<SequenceInfluencersPutRequestResponse, { body: SequenceInfluencersPutRequestBody }>(
                    '/api/sequence-influencers',
                    { body: update },
                    { method: 'PUT' },
                );
                optimisticUpdateSequenceInfluencer(threadData, update);
            }
        } catch (error: any) {
            serverLogger(error);
        }
    }
};

export const useAddress = (
    threadData: ThreadData[],
    optimisticUpdateSequenceInfluencer: (
        currentData: ThreadData[],
        newSequenceInfluencerData: SequenceInfluencersPutRequestBody,
    ) => ThreadData[],
    influencer?: InfluencerOutreachData | null,
) => {
    const addressId = influencer?.address_id;

    useEffect(() => {
        createAddressIfMissing(threadData, optimisticUpdateSequenceInfluencer, influencer);
    }, [influencer, optimisticUpdateSequenceInfluencer, threadData]);

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
