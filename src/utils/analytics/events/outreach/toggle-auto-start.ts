import type { EventPayload, TriggerEvent } from '../../types';

export const TOGGLE_AUTO_START = 'Toggle Auto-Start';

export type ToggleAutoStartPayload = EventPayload<{
    action: 'Enable' | 'Disable';
    total_sequence_influencers: number;
    unstarted_sequence_influencers: number;
    sequence_id: string;
    sequence_name: string;
}>;

export const ToggleAutoStart = (trigger: TriggerEvent<ToggleAutoStartPayload>, payload?: ToggleAutoStartPayload) =>
    trigger(TOGGLE_AUTO_START, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
ToggleAutoStart.eventName = <typeof TOGGLE_AUTO_START>TOGGLE_AUTO_START;
