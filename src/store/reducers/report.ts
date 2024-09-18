import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type Nullable } from 'types/nullable';

type SelectedInfluencerType = {
    name: string;
};

interface ReportState {
    errorMessage: string;
    errorStatus: Nullable<string>;
    usageExceeded: boolean;
    selectedInfluencer: Nullable<SelectedInfluencerType>;
}

const initialState: ReportState = {
    errorMessage: '',
    errorStatus: null,
    usageExceeded: false,
    selectedInfluencer: null,
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
        setSelectedInfluencer: (state, action: PayloadAction<Nullable<SelectedInfluencerType>>) => {
            state.selectedInfluencer = action.payload;
        },
    },
});

const { setErrorMessage, setErrorStatus, setUsageExceeded, setSelectedInfluencer } = pageSlice.actions;

export const useReportStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.report);
    return {
        ...states,
        setErrorMessage: (err: string) => dispatch(setErrorMessage(err)),
        setErrorStatus: (err: Nullable<string>) => dispatch(setErrorStatus(err)),
        setUsageExceeded: (err: boolean) => dispatch(setUsageExceeded(err)),
        setSelectedInfluencer: (influencer: Nullable<SelectedInfluencerType>) =>
            dispatch(setSelectedInfluencer(influencer)),
    };
};

export default pageSlice.reducer;
