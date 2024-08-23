import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';

interface TemplateVariableProps {
    sequenceFilterLoading: boolean;
}

const initialState: TemplateVariableProps = {
    sequenceFilterLoading: false,
};

const pageSlice = createSlice({
    name: 'inbox-filter',
    initialState,
    reducers: {
        setSequenceFilterLoading: (state, action: PayloadAction<boolean>) => {
            state.sequenceFilterLoading = action.payload;
        },
    },
});

const { setSequenceFilterLoading } = pageSlice.actions;

export const useInboxFilter = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.inboxFilter);
    return {
        ...states,
        setSequenceFilterLoading: (loading: boolean) => dispatch(setSequenceFilterLoading(loading)),
    };
};

export default pageSlice.reducer;
