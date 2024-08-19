import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';
import { type Nullable } from 'types/nullable';

interface TemplateVariableProps {
    list: OutreachEmailTemplateVariableEntity[];
    item: Nullable<OutreachEmailTemplateVariableEntity>;
    isEdit: boolean;
}

const initialState: TemplateVariableProps = {
    list: [],
    item: null,
    isEdit: false,
};

const pageSlice = createSlice({
    name: 'template-variable',
    initialState,
    reducers: {
        setTemplateVariables: (state, action: PayloadAction<OutreachEmailTemplateVariableEntity[]>) => {
            state.list = action.payload;
        },
        setTemplateVariable: (state, action: PayloadAction<Nullable<OutreachEmailTemplateVariableEntity>>) => {
            state.item = action.payload;
        },
        setIsEdit: (state, action: PayloadAction<boolean>) => {
            state.isEdit = action.payload;
        },
    },
});

const { setTemplateVariables, setTemplateVariable, setIsEdit } = pageSlice.actions;

export const useTemplateVariableStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.templateVariable);
    return {
        ...states,
        setTemplateVariables: (variables: OutreachEmailTemplateVariableEntity[]) =>
            dispatch(setTemplateVariables(variables)),
        setTemplateVariable: (variable: Nullable<OutreachEmailTemplateVariableEntity>) =>
            dispatch(setTemplateVariable(variable)),
        setIsEdit: (isEdit: boolean) => dispatch(setIsEdit(isEdit)),
    };
};

export default pageSlice.reducer;
