import type { EventPayload, TriggerEvent } from '../../types';

export const SAVE_TEMPLATE_VARIABLE_UPDATES = 'Save Template Variable Updates';
export type SaveTemplateVariableUpdatesPayload = EventPayload<{
    sequence_id: string;
    sequence_name: string;
    variables_updated: (string | undefined)[];
    batch_id: number;
}>;

export const SaveTemplateVariableUpdates = (
    trigger: TriggerEvent<SaveTemplateVariableUpdatesPayload>,
    payload?: SaveTemplateVariableUpdatesPayload,
) => trigger(SAVE_TEMPLATE_VARIABLE_UPDATES, payload);

SaveTemplateVariableUpdates.eventName = <typeof SAVE_TEMPLATE_VARIABLE_UPDATES>SAVE_TEMPLATE_VARIABLE_UPDATES;
