import type { AxiosRequestConfig } from 'axios';
import { atom, useAtom } from 'jotai';
import type { UpdateAddressRequest } from 'pages/api/v2/sequence-influencers/[id]/addresses/request';
import type { UpdateSequenceInfluencerRequest } from 'pages/api/v2/sequence-influencers/[id]/request';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const manageProfileUpdating = atom(false);
export const useManageProfileUpdating = () => useAtom(manageProfileUpdating);
export const useSequenceInfluencer = () => {
    const [updating, setUpdating] = useManageProfileUpdating();
    const { apiClient, error } = useApiClient();
    const updateSequenceInfluencer = async (
        sequenceInfluencerId: string,
        data: UpdateSequenceInfluencerRequest,
        options?: AxiosRequestConfig,
    ) => {
        setUpdating(true);
        const [, response] = await awaitToError(
            apiClient.patch(`/v2/sequence-influencers/${sequenceInfluencerId}`, data, options),
        );
        setUpdating(false);
        return response;
    };
    return { updating, setUpdating, updateSequenceInfluencer, error };
};

export const useSequenceInfluencerAddress = () => {
    const [updating, setUpdating] = useManageProfileUpdating();
    const { apiClient, error } = useApiClient();
    const updateSequenceInfluencerAddress = async (
        sequenceInfluencerId: string,
        data: UpdateAddressRequest,
        options?: AxiosRequestConfig,
    ) => {
        setUpdating(true);
        const [, response] = await awaitToError(
            apiClient.patch(`/v2/sequence-influencers/${sequenceInfluencerId}/addresses`, data, options),
        );
        setUpdating(false);
        return response;
    };
    return { updating, setUpdating, updateSequenceInfluencerAddress, error };
};
