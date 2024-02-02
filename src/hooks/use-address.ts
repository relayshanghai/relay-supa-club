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
import { useEffect, useState } from 'react';
import type { SequenceInfluencerManagerPageWithChannelData } from 'pages/api/sequence/influencers';

const createAddressIfMissing = async (
    influencer?: InfluencerOutreachData | SequenceInfluencerManagerPageWithChannelData | null,
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
            }
            return newAddress.content.id;
        } catch (error: any) {
            serverLogger(error);
        }
    }
};

export const useAddress = (
    influencer?: InfluencerOutreachData | SequenceInfluencerManagerPageWithChannelData | null,
) => {
    const [addressId, setAddressId] = useState<string | null>(influencer?.address_id || null);
    useEffect(() => {
        if (influencer?.address_id) {
            setAddressId(influencer.address_id);
        }
    }, [influencer]);

    useEffect(() => {
        const checkAndGetAddress = async () => {
            const newAddressId = await createAddressIfMissing(influencer);
            if (newAddressId) {
                setAddressId(newAddressId);
            }
        };
        checkAndGetAddress();
    }, [influencer]);

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
