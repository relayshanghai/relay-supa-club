import type { EventPayload, TriggerEvent } from '../../types';

export const VIEW_SEQUENCE_TEMPLATES = 'View Sequence Templates';

export type ViewSequenceTemplatesPayload = EventPayload<{
    sequence_id: string;
    sequence_name: string;
    variables_set: boolean;
}>;

export const ViewSequenceTemplates = (
    trigger: TriggerEvent<ViewSequenceTemplatesPayload>,
    payload?: ViewSequenceTemplatesPayload,
) => trigger(VIEW_SEQUENCE_TEMPLATES, payload);

ViewSequenceTemplates.eventName = <typeof VIEW_SEQUENCE_TEMPLATES>VIEW_SEQUENCE_TEMPLATES;
