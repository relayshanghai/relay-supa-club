import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { OutreachStepRequest, type TemplateRequest } from 'pages/api/outreach/email-templates/request';

interface TemplateVariableProps {
    list: OutreachEmailTemplateEntity[];
    item: TemplateRequest;
}

const initialState: TemplateVariableProps = {
    list: [],
    item: {
        subject: '',
        name: '',
        description: '',
        template: '',
        variableIds: [],
        step: OutreachStepRequest.OUTREACH,
    },
};

const pageSlice = createSlice({
    name: 'template-variable',
    initialState,
    reducers: {
        setEmailTemplates: (state, action: PayloadAction<OutreachEmailTemplateEntity[]>) => {
            state.list = action.payload;
        },
        setEmailTemplate: (state, action: PayloadAction<TemplateRequest>) => {
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
        setEmailTemplate: (variable: TemplateRequest) => dispatch(setEmailTemplate(variable)),
    };
};

export default pageSlice.reducer;
