import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';

interface TemplateVariableProps {
    filterLoading: boolean;
}

const initialState: TemplateVariableProps = {
    filterLoading: false,
};

const pageSlice = createSlice({
    name: 'inbox-filter',
    initialState,
    reducers: {
        setFilterLoading: (state, action: PayloadAction<boolean>) => {
            state.filterLoading = action.payload;
        },
    },
});

const { setFilterLoading } = pageSlice.actions;

export const useInboxFilter = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.inboxFilter);
    return {
        ...states,
        setFilterLoading: (loading: boolean) => dispatch(setFilterLoading(loading)),
    };
};

export default pageSlice.reducer;
