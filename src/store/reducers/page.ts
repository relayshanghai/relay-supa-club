import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';

const initialState = {
    currentPage: 1,
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { setCurrentPage } = pageSlice.actions;

export const usePage = () => {
    const dispatch = useAppDispatch();
    const pageState = useAppSelector((state) => state.page);
    return {
        currentPage: pageState.currentPage,
        setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    };
};

export default pageSlice.reducer;
