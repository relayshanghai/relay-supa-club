import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const HOVER_TOOLTIP = 'Hover Tooltip';

export type HoverTooltipPayload = {
    currentPage: CurrentPageEvent;
};

export const HoverTooltip = (trigger: TriggerEvent, value?: HoverTooltipPayload) =>
    trigger(HOVER_TOOLTIP, { ...value });

HoverTooltip.eventName = <typeof HOVER_TOOLTIP>HOVER_TOOLTIP;
