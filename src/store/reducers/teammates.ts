import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { type CompanyJoinRequestEntity } from 'src/backend/database/company-join-request/company-join-request-entity';

interface ClassicSearchParamsProps {
    teammates: ProfileEntity[];
    joinRequests: CompanyJoinRequestEntity[];
}

const initialState: ClassicSearchParamsProps = {
    teammates: [],
    joinRequests: [],
};

const pageSlice = createSlice({
    name: 'teammates',
    initialState,
    reducers: {
        setTeammates: (state, action: PayloadAction<ProfileEntity[]>) => {
            state.teammates = action.payload;
        },
        setJoinRequests: (state, action: PayloadAction<CompanyJoinRequestEntity[]>) => {
            state.joinRequests = action.payload;
        },
    },
});

const { setTeammates, setJoinRequests } = pageSlice.actions;

export const useTeammatesStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.teammates);
    return {
        ...states,
        setTeammates: (data: ProfileEntity[]) => dispatch(setTeammates(data)),
        setJoinRequests: (data: CompanyJoinRequestEntity[]) => dispatch(setJoinRequests(data)),
    };
};

export default pageSlice.reducer;
