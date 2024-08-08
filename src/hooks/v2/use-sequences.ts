/* eslint-disable react-hooks/exhaustive-deps */
import { type GetAllSequenceResponse } from 'pages/api/v2/sequences/response';
import { useEffect, useState } from 'react';
import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { type RateInfo } from 'types/v2/rate-info';
import { create } from 'zustand';
import { usePaginationParam } from './use-pagination-param';

interface SequenceStore {
    sequences: SequenceEntity[];
    setSequences: (sequences: SequenceEntity[]) => void;
    resetSequences: () => void;
}

const useSequencesStore = create<SequenceStore>((set) => ({
    sequences: [] as SequenceEntity[],
    setSequences: (sequences: SequenceEntity[]) => set({ sequences: sequences }),
    resetSequences: () => set({ sequences: [] }),
}));

export const useSequences = () => {
    const { page, setPage, setSize, size } = usePaginationParam();
    const [totalPages, setTotalPages] = useState(0);
    const [sequences, setSequences] = useState<SequenceEntity[]>([]);
    const [rateInfo, setRateInfo] = useState<RateInfo>({
        bounced: 0,
        open: 0,
        replied: 0,
        sent: 0,
        total: 0,
    });
    const { loading, error, apiClient } = useApiClient();
    const getAllSequences = async () => {
        const [, response] = await awaitToError(
            apiClient.get<GetAllSequenceResponse>(`/v2/sequences?page=${page}&size=${size}`),
        );
        if (response) {
            setSequences(response.data.items);
            setRateInfo(response.data.rateInfo);
            setTotalPages(response.data.totalPages);
        }
    };

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
        rateInfo,
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
