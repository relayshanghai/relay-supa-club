import type { EventPayload, TriggerEvent } from '../../types';

export const CHANGE_SEQUENCE_TAB = 'Change Sequence Tab';

export type ChangeSequenceTabPayload = EventPayload<{
    current_tab: string;
    selected_tab: string;
    sequence_id: string;
    sequence_name: string;
}>;

export const ChangeSequenceTab = (
    trigger: TriggerEvent<ChangeSequenceTabPayload>,
    payload?: ChangeSequenceTabPayload,
) => trigger(CHANGE_SEQUENCE_TAB, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
ChangeSequenceTab.eventName = <typeof CHANGE_SEQUENCE_TAB>CHANGE_SEQUENCE_TAB;
