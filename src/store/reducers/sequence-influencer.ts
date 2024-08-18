import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type Paginated } from 'types/pagination';
import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';

interface SequenceInfluencerState {
    list: Paginated<SequenceInfluencerEntity>;
    item: Partial<SequenceInfluencerEntity>;
    selectedList: SequenceInfluencerEntity[];
    unlocking?: string;
}

const initialState: SequenceInfluencerState = {
    list: {
        items: [],
        page: 1,
        totalPages: 1,
        size: 0,
        totalSize: 0,
    },
    item: {},
    selectedList: [],
    unlocking: '',
};

const pageSlice = createSlice({
    name: 'sequenceInfluencer',
    initialState,
    reducers: {
        setSequenceInfluencers: (state, action: PayloadAction<Paginated<SequenceInfluencerEntity>>) => {
            state.list = action.payload;
        },
        setSequenceInfluencerByIndex(
            state,
            action: PayloadAction<{ index: number; influencer: SequenceInfluencerEntity }>,
        ) {
            state.list.items[action.payload.index] = action.payload.influencer;
        },
        setSequenceInfluencer: (state, action: PayloadAction<SequenceInfluencerEntity>) => {
            state.item = action.payload;
        },
        setSelectedInfluencers: (state, action: PayloadAction<SequenceInfluencerEntity[]>) => {
            state.selectedList = action.payload;
        },
        setUnlock: (state, action: PayloadAction<string | undefined>) => {
            state.unlocking = action.payload;
        },
    },
});

const {
    setSequenceInfluencers,
    setSequenceInfluencer,
    setSequenceInfluencerByIndex,
    setSelectedInfluencers,
    setUnlock,
} = pageSlice.actions;

export const useSequenceInfluencerStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.sequenceInfluencer);
    return {
        ...states,
        setSequenceInfluencers: (influencer: Paginated<SequenceInfluencerEntity>) =>
            dispatch(setSequenceInfluencers(influencer)),
        setSequenceInfluencerByIndex: (index: number, influencer: SequenceInfluencerEntity) =>
            dispatch(setSequenceInfluencerByIndex({ index, influencer })),
        setSequenceInfluencer: (influencer: SequenceInfluencerEntity) => dispatch(setSequenceInfluencer(influencer)),
        setSelectedInfluencers: (influencers: SequenceInfluencerEntity[]) =>
            dispatch(setSelectedInfluencers(influencers)),
        setUnlock: (unlock?: string) => dispatch(setUnlock(unlock)),
    };
};

export default pageSlice.reducer;
