import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    Step,
    type OutreachEmailTemplateEntity,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { OutreachStepRequest } from 'pages/api/outreach/email-templates/request';
import { type GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import { type Nullable } from 'types/nullable';

interface TemplateVariableProps {
    list: OutreachEmailTemplateEntity[];
    item: GetTemplateResponse;
    tempItem: Nullable<GetTemplateResponse>;
    editMode: boolean;
    saveExistingAsNew: boolean;
    selectionStep: Nullable<Step>;
}

const initialState: TemplateVariableProps = {
    list: [],
    item: {
        id: '',
        subject: '',
        name: '',
        description: '',
        template: '',
        variables: [],
        step: OutreachStepRequest.OUTREACH,
    },
    tempItem: null,
    editMode: false,
    saveExistingAsNew: false,
    selectionStep: Step.OUTREACH,
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
        setTempEmailTemplate: (state, action: PayloadAction<GetTemplateResponse>) => {
            state.tempItem = action.payload;
        },
        setEditMode: (state, action: PayloadAction<boolean>) => {
            state.editMode = action.payload;
        },
        setSaveExistingAsNew: (state, action: PayloadAction<boolean>) => {
            state.saveExistingAsNew = action.payload;
        },
        setSelectionStep: (state, action: PayloadAction<Step>) => {
            state.selectionStep = action.payload;
        },
    },
});

const {
    setEmailTemplates,
    setEmailTemplate,
    setEditMode,
    setSaveExistingAsNew,
    setTempEmailTemplate,
    setSelectionStep,
} = pageSlice.actions;

export const useEmailTemplateStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.emailTemplate);
    return {
        ...states,
        initialState,
        setEmailTemplates: (templates: OutreachEmailTemplateEntity[]) => dispatch(setEmailTemplates(templates)),
        setEmailTemplate: (template: GetTemplateResponse) => dispatch(setEmailTemplate(template)),
        setTempEmailTemplate: (template: GetTemplateResponse) => dispatch(setTempEmailTemplate(template)),
        setIsEdit: (edit: boolean) => dispatch(setEditMode(edit)),
        setSaveExistingAsNew: (saveAsNew: boolean) => dispatch(setSaveExistingAsNew(saveAsNew)),
        setSelectionStep: (step: Step) => dispatch(setSelectionStep(step)),
    };
};

export default pageSlice.reducer;
