import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const PRICING_SECTION_SELECT_DIY_MAX = 'Signup Wizard, Pricing Section, click to select DIY Max';

export type PricingSectionSelectDiyMaxPayload = {
    currentPage: CurrentPageEvent;
};

export const PricingSectionSelectDiyMax = (trigger: TriggerEvent, value?: PricingSectionSelectDiyMaxPayload) =>
    trigger(PRICING_SECTION_SELECT_DIY_MAX, { ...value });

PricingSectionSelectDiyMax.eventName = <typeof PRICING_SECTION_SELECT_DIY_MAX>PRICING_SECTION_SELECT_DIY_MAX;
