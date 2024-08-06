import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';
import { type Nullable } from 'types/nullable';

interface ProductState {
    list: OutreachEmailTemplateVariableEntity[];
    item: Nullable<OutreachEmailTemplateVariableEntity>;
}

const initialState: ProductState = {
    list: [],
    item: null,
};

const pageSlice = createSlice({
    name: 'template-variable',
    initialState,
    reducers: {
        setTemplateVariables: (state, action: PayloadAction<OutreachEmailTemplateVariableEntity[]>) => {
            state.list = action.payload;
        },
        setTemplateVariable: (state, action: PayloadAction<OutreachEmailTemplateVariableEntity>) => {
            state.item = action.payload;
        },
    },
});

const { setTemplateVariables, setTemplateVariable } = pageSlice.actions;

export const useTemplateVariableStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.templateVariable);
    return {
        ...states,
        setTemplateVariables: (variables: OutreachEmailTemplateVariableEntity[]) =>
            dispatch(setTemplateVariables(variables)),
        setTemplateVariable: (variable: OutreachEmailTemplateVariableEntity) => dispatch(setTemplateVariable(variable)),
    };
};

export default pageSlice.reducer;
