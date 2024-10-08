/* eslint-disable react-hooks/exhaustive-deps */
import { type GetAllSequenceResponse } from 'pages/api/v2/sequences/response';
import { useEffect, useState } from 'react';
import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { type SequenceInfo } from 'types/v2/rate-info';
import { usePaginationParam } from './use-pagination-param';
import { useSequencesStore } from 'src/store/reducers/sequence';
import type { SequenceRequest } from 'pages/api/v2/outreach/sequences/request';
import type { GetSequenceDetailResponse } from 'pages/api/v2/sequences/[id]/response';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import useSWR from 'swr';
import { GlobalTemplateVariables } from 'src/backend/domain/templates/constants';

export const useSequences = () => {
    const { page, setPage, setSize, size } = usePaginationParam();
    const { sequences, setSequences } = useSequencesStore();
    const [totalPages, setTotalPages] = useState(0);
    const [info, setSequenceInfo] = useState<SequenceInfo>({
        bounced: 0,
        open: 0,
        replied: 0,
        sent: 0,
        total: 0,
        ignored: 0,
        unscheduled: 0,
        inSequence: 0,
    });
    const { loading, error, apiClient } = useApiClient();

    const { mutate: getAllSequences } = useSWR(['/v2/sequences'], async () => {
        const [err, response] = await awaitToError(
            apiClient.get<GetAllSequenceResponse>(`/v2/sequences?page=${page}&size=${size}`),
        );
        if (err) {
            throw err;
        }
        setSequences(response.data.items);
        setSequenceInfo(response.data.info);
        setTotalPages(response.data.totalPages);
        return response.data;
    });

    useEffect(() => {
        if (sequences.length === 0) {
            getAllSequences();
        }
    }, []);
    useEffect(() => {
        getAllSequences();
    }, [page, size]);
    return {
        sequences,
        info,
        getAllSequences,
        loading,
        error,
        setPage,
        setSize,
        size,
        page,
        totalPages,
        setTotalPages,
    };
};

export const useSequence = () => {
    const {
        sequence,
        setSequence,
        selectedTemplate,
        setSelectedTemplate,
        sequenceVariables,
        setSequenceVariables,
        setEditMode,
        editMode: isEdit,
    } = useSequencesStore();
    const { apiClient, loading, error } = useApiClient();
    const createSequences = async (payload: SequenceRequest) => {
        //exclude GlobalTemplateVariables variables
        payload.variables = payload.variables?.filter((v) => !GlobalTemplateVariables.some((g) => g.name === v.name));
        const [err, res] = await awaitToError(apiClient.post<SequenceEntity>('/v2/outreach/sequences', payload));
        if (err) throw err;
        return res.data;
    };
    const updateSequences = async (id: string, payload: SequenceRequest) => {
        //exclude GlobalTemplateVariables variables
        payload.variables = payload.variables?.filter((v) => !GlobalTemplateVariables.some((g) => g.name === v.name));
        const [err, res] = await awaitToError(apiClient.put(`/v2/outreach/sequences/${id}`, payload));
        if (err) throw err;
        return res.data;
    };
    const getSequence = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.get<SequenceEntity>(`/v2/sequences/${id}`));
        if (err) throw err;
        setSequence(res.data);
        return res.data;
    };
    return {
        sequence,
        setSequence,
        selectedTemplate,
        setSelectedTemplate,
        sequenceVariables,
        setSequenceVariables,
        createSequences,
        updateSequences,
        getSequence,
        setEditMode,
        isEdit,
        loading,
        error,
    };
};

export const useDropdownSequence = () => {
    const { sequences, setSequences } = useSequencesStore();
    const { loading, error, apiClient } = useApiClient();
    const getAllSequences = async () => {
        const [, response] = await awaitToError(apiClient.get<SequenceEntity[]>('/v2/sequences/dropdown'));
        if (response) {
            setSequences(response.data);
        }
    };

    useEffect(() => {
        if (sequences.length === 0) {
            getAllSequences();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        sequences,
        getAllSequences,
        loading,
        error,
    };
};

export const useSequenceDetail = (id: string) => {
    const [sequence, setSequences] = useState<SequenceEntity>();
    const [info, setSequenceInfo] = useState<SequenceInfo>({
        bounced: 0,
        open: 0,
        replied: 0,
        sent: 0,
        total: 0,
        ignored: 0,
        unscheduled: 0,
        inSequence: 0,
    });
    const { loading, apiClient } = useApiClient();
    const getSequence = async () => {
        const [, response] = await awaitToError(apiClient.get<GetSequenceDetailResponse>(`/v2/sequences/${id}`));
        if (response) {
            setSequences(response.data);
            setSequenceInfo(response.data.info);
        }
    };

    const scheduleEmails = async (influencers: SequenceInfluencerEntity[]) => {
        const [, response] = await awaitToError(
            apiClient.post(`/v2/sequences/${id}/schedule`, {
                sequenceInfluencersIds: influencers.map((influencer) => influencer.id),
            }),
        );
        if (response) {
            return response;
        }
    };

    useEffect(() => {
        if (!sequence) {
            getSequence();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { scheduleEmails, getSequence, loading, sequence, info };
};
