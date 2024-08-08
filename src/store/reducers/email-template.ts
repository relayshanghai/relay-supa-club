import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { type GetTemplateResponse } from 'pages/api/outreach/email-templates/response';

interface TemplateVariableProps {
    list: OutreachEmailTemplateEntity[];
    item: GetTemplateResponse;
}

const initialState: TemplateVariableProps = {
    list: [],
    item: {
        id: '',
        subject: '',
        name: '',
        template: '',
        variables: [],
        step: 'OUTREACH',
    },
};

const pageSlice = createSlice({
    name: 'template-variable',
    initialState,
    reducers: {
        setEmailTemplates: (state, action: PayloadAction<OutreachEmailTemplateEntity[]>) => {
            state.list = action.payload;
        },
        setEmailTemplate: (state, action: PayloadAction<GetTemplateResponse>) => {
            state.item = action.payload;
        },
    },
});

const { setEmailTemplates, setEmailTemplate } = pageSlice.actions;

export const useEmailTemplateStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.emailTemplate);
    return {
        ...states,
        setEmailTemplates: (variables: OutreachEmailTemplateEntity[]) => dispatch(setEmailTemplates(variables)),
        setEmailTemplate: (variable: GetTemplateResponse) => dispatch(setEmailTemplate(variable)),
    };
};

export default pageSlice.reducer;
