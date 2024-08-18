import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    Step,
    type OutreachEmailTemplateEntity,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { type Nullable } from 'types/nullable';

export interface SequenceEmailWithStep extends OutreachEmailTemplateEntity {
    step: Step;
}

export type StagedSequenceEmailTemplateType = Record<Step, Nullable<SequenceEmailWithStep>>;

interface SequenceEmailTemplateProps {
    sequenceEmailTemplate: Nullable<OutreachEmailTemplateEntity>;
    stagedSequenceEmailTemplates: StagedSequenceEmailTemplateType;
}

const initialState: SequenceEmailTemplateProps = {
    sequenceEmailTemplate: null,
    stagedSequenceEmailTemplates: {
        [Step.OUTREACH]: null,
        [Step.FIRST_FOLLOW_UP]: null,
        [Step.SECOND_FOLLOW_UP]: null,
        [Step.THIRD_FOLLOW_UP]: null,
    },
};

const pageSlice = createSlice({
    name: 'sequence-template',
    initialState,
    reducers: {
        setSequenceEmailTemplate: (
            state,
            sequenceEmailTemplate: PayloadAction<Nullable<OutreachEmailTemplateEntity>>,
        ) => {
            state.sequenceEmailTemplate = sequenceEmailTemplate.payload;
        },
        resetSequenceEmailTemplate: (state) => {
            state.sequenceEmailTemplate = null;
        },
        setStagedSequenceEmailTemplate: (
            state,
            sequenceEmailTemplates: PayloadAction<Record<Step, Nullable<SequenceEmailWithStep>>>,
        ) => {
            state.stagedSequenceEmailTemplates = sequenceEmailTemplates.payload;
        },
        resetStagedSequenceEmailTemplate: (state) => {
            state.stagedSequenceEmailTemplates = {
                [Step.OUTREACH]: null,
                [Step.FIRST_FOLLOW_UP]: null,
                [Step.SECOND_FOLLOW_UP]: null,
                [Step.THIRD_FOLLOW_UP]: null,
            };
        },
    },
});

const {
    setSequenceEmailTemplate,
    resetSequenceEmailTemplate,
    setStagedSequenceEmailTemplate,
    resetStagedSequenceEmailTemplate,
} = pageSlice.actions;

export const useSequenceEmailTemplateStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.sequenceTemplate);
    return {
        ...states,
        initialState,
        setSequenceEmailTemplate: (sequenceEmailTemplate: Nullable<OutreachEmailTemplateEntity>) =>
            dispatch(setSequenceEmailTemplate(sequenceEmailTemplate)),
        resetSequenceEmailTemplate: () => dispatch(resetSequenceEmailTemplate()),
        setStagedSequenceEmailTemplate: (sequenceEmailTemplates: Record<Step, Nullable<SequenceEmailWithStep>>) =>
            dispatch(setStagedSequenceEmailTemplate(sequenceEmailTemplates)),
        resetStagedSequenceEmailTemplate: () => dispatch(resetStagedSequenceEmailTemplate()),
    };
};

export default pageSlice.reducer;
