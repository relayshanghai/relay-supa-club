import type { EventPayload, TriggerEvent } from '../../types';

export const UPDATE_TEMPLATE_VARIABLE = 'Update Template Variable';

export type UpdateTemplateVariablePayload = EventPayload<{
    sequence_id: string;
    sequence_name: string;
    template_variable: string;
    variable_value: string;
    updating_existing_value: boolean;
    batch_id: number;
}>;

export const UpdateTemplateVariable = (
    trigger: TriggerEvent<UpdateTemplateVariablePayload>,
    payload?: UpdateTemplateVariablePayload,
) => trigger(UPDATE_TEMPLATE_VARIABLE, payload);

UpdateTemplateVariable.eventName = <typeof UPDATE_TEMPLATE_VARIABLE>UPDATE_TEMPLATE_VARIABLE;
