import { useEffect } from 'react';
import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { create } from 'zustand';

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
    const { sequences, setSequences } = useSequencesStore();
    const { loading, error, apiClient } = useApiClient();
    const getAllSequences = async () => {
        const [, response] = await awaitToError(apiClient.get<SequenceEntity[]>('/v2/sequences'));
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
