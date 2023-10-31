import type { TriggerEvent } from '../types';

export const TOGGLE_NAVBAR_SIZE = 'Toggle Navbar Size';

export type ToggleNavbarSizePayload = {
    navbar_action: 'Expand' | 'Collapse';
};

export const ToggleNavbarSize = (trigger: TriggerEvent, value?: ToggleNavbarSizePayload) =>
    trigger(TOGGLE_NAVBAR_SIZE, { ...value });

ToggleNavbarSize.eventName = <typeof TOGGLE_NAVBAR_SIZE>TOGGLE_NAVBAR_SIZE;
