import type { TriggerEvent } from '../types';

export const HOVER_TOOLTIP = 'Hover Tooltip';

export type HoverTooltipPayload = {
    tooltip: string;
};

export const HoverTooltip = (trigger: TriggerEvent, value?: HoverTooltipPayload) =>
    trigger(HOVER_TOOLTIP, { ...value });

HoverTooltip.eventName = <typeof HOVER_TOOLTIP>HOVER_TOOLTIP;
