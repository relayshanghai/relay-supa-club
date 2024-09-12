import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type Nullable } from 'types/nullable';

interface ReportState {
    errorMessage: string;
    errorStatus: Nullable<string>;
    usageExceeded: boolean;
}

const initialState: ReportState = {
    errorMessage: '',
    errorStatus: null,
    usageExceeded: false,
};

const pageSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        setErrorStatus: (state, action: PayloadAction<Nullable<string>>) => {
            state.errorStatus = action.payload;
        },
        setUsageExceeded: (state, action: PayloadAction<boolean>) => {
            state.usageExceeded = action.payload;
        },
    },
});

const { setErrorMessage, setErrorStatus, setUsageExceeded } = pageSlice.actions;

export const useReportStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.report);
    return {
        ...states,
        setErrorMessage: (err: string) => dispatch(setErrorMessage(err)),
        setErrorStatus: (err: Nullable<string>) => dispatch(setErrorStatus(err)),
        setUsageExceeded: (err: boolean) => dispatch(setUsageExceeded(err)),
    };
};

export default pageSlice.reducer;
