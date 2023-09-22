import type { EventPayload, TriggerEvent } from '../../types';

export const TOGGLE_VIEW_MINE = 'Toggle View Mine';

export type ToggleViewMinePayload = EventPayload<{
    action: 'Enable' | 'Disable';
    total_managed_influencers: number;
    total_users_influencers: number;
}>;

export const ToggleViewMine = (trigger: TriggerEvent<ToggleViewMinePayload>, payload?: ToggleViewMinePayload) =>
    trigger(TOGGLE_VIEW_MINE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
ToggleViewMine.eventName = <typeof TOGGLE_VIEW_MINE>TOGGLE_VIEW_MINE;
