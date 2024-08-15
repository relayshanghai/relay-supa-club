/* eslint-disable react-hooks/exhaustive-deps */

import type { AxiosRequestConfig } from 'axios';
import { atom, useAtom } from 'jotai';
import type { UpdateAddressRequest } from 'pages/api/v2/sequence-influencers/[id]/addresses/request';
import type { UpdateSequenceInfluencerRequest } from 'pages/api/v2/sequence-influencers/[id]/request';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { usePaginationParam } from './use-pagination-param';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import query from 'query-string';
import { type Paginated } from 'types/pagination';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import { useSequenceInfluencerStore } from 'src/store/reducers/sequence-influencer';
import { type SequenceInfluencersDeleteRequestBody } from 'pages/api/sequence/influencers/delete';
export const manageProfileUpdating = atom(false);
export const useManageProfileUpdating = () => useAtom(manageProfileUpdating);
export const useSequenceInfluencerUpdate = () => {
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

export const useSequenceInfluencer = (sequenceId: string) => {
    const { page, size, setPage, setSize } = usePaginationParam();
    const { apiClient, loading, error } = useApiClient();
    const [status, setStatus] = useState<string>();
    const [search, setSearch] = useState('');
    const q = query.stringify({
        page,
        size,
        status,
        search,
    });
    const {
        list,
        setSequenceInfluencers,
        setSelectedInfluencers,
        selectedList: selectedInfluencers,
    } = useSequenceInfluencerStore();
    const { data: sequenceInfluencer, mutate: refreshSequenceInfluencer } = useSWR(
        `/v2/sequences/${sequenceId}/influencers?${q}`,
        async (path: string) => {
            const response = await apiClient.get<Paginated<SequenceInfluencerEntity>>(path);
            return response.data;
        },
    );
    useEffect(() => {
        sequenceInfluencer && setSequenceInfluencers(sequenceInfluencer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sequenceInfluencer]);

    const deleteInfluencers = async () => {
        if (selectedInfluencers.length < 1) return;
        const body: SequenceInfluencersDeleteRequestBody = { ids: selectedInfluencers.map((d) => d.id) };
        const [err, res] = await awaitToError(apiClient.post('/sequence/influencers/delete', body));
        if (err) {
            throw err;
        }
        return res;
    };

    return {
        data: list,
        setStatus,
        status,
        search,
        setSearch,
        loading,
        error,
        setPage,
        page,
        setSize,
        size,
        setSelectedInfluencers,
        selectedInfluencers,
        deleteInfluencers,
        refreshSequenceInfluencer,
    };
};

export const useSequenceInfluencerEmail = (sequenceId: string, sequenceInfluencerId: string) => {
    const { apiClient, loading } = useApiClient();
    const updateEmail = async (email: string) => {
        const [err] = await awaitToError(
            apiClient.patch(`/v2/sequences/${sequenceId}/influencers/${sequenceInfluencerId}`, { email }),
        );
        return err ? false : true;
    };
    return {
        updateEmail,
        loading,
    };
};
