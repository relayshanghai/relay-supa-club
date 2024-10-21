import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';

interface ClassicSearchParamsProps {
    currentPage: number;
    totalInfluencer: number;
}

const initialState: ClassicSearchParamsProps = {
    currentPage: 1,
    totalInfluencer: 0,
};

const pageSlice = createSlice({
    name: 'classic-search-params',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setTotalInfluencer: (state, action: PayloadAction<number>) => {
            state.totalInfluencer = action.payload;
        },
    },
});

const { setCurrentPage, setTotalInfluencer } = pageSlice.actions;

export const useClassicSearchParams = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.classicSearchParams);
    return {
        ...states,
        setCurrentPage: (data: number) => dispatch(setCurrentPage(data)),
        setTotalInfluencer: (data: number) => dispatch(setTotalInfluencer(data)),
    };
};

export default pageSlice.reducer;
