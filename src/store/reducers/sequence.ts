import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { type Nullable } from 'types/nullable';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';

export type VariableWithValue = OutreachEmailTemplateVariableEntity & { value?: string };

export type TemplateWithVariableValueType = OutreachEmailTemplateEntity & {
    variables: VariableWithValue[];
};

interface SequenceStore {
    sequences: SequenceEntity[];
    sequence: Nullable<SequenceEntity>;
    selectedTemplate: Nullable<TemplateWithVariableValueType>;
    sequenceVariables: VariableWithValue[];
}

const initialState: SequenceStore = {
    sequences: [],
    sequence: null,
    selectedTemplate: null,
    sequenceVariables: [],
};

const pageSlice = createSlice({
    name: 'sequence',
    initialState,
    reducers: {
        setSequences: (state, action: PayloadAction<SequenceEntity[]>) => {
            state.sequences = action.payload;
        },
        setSequence: (state, action: PayloadAction<Nullable<SequenceEntity>>) => {
            state.sequence = action.payload;
        },
        setSelectedTemplate: (state, action: PayloadAction<Nullable<TemplateWithVariableValueType>>) => {
            state.selectedTemplate = action.payload;
        },
        setSequenceVariables: (state, action: PayloadAction<VariableWithValue[]>) => {
            state.sequenceVariables = action.payload;
        },
    },
});

const { setSequences, setSequence, setSelectedTemplate, setSequenceVariables } = pageSlice.actions;

export const useSequencesStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.sequence);
    return {
        ...states,
        setSequences: (items: SequenceEntity[]) => dispatch(setSequences(items)),
        setSequence: (item: Nullable<SequenceEntity>) => dispatch(setSequence(item)),
        resetSequences: () => dispatch(setSequences([])),
        setSelectedTemplate: (item: Nullable<TemplateWithVariableValueType>) => dispatch(setSelectedTemplate(item)),
        setSequenceVariables: (item: VariableWithValue[]) => dispatch(setSequenceVariables(item)),
    };
};

export default pageSlice.reducer;
