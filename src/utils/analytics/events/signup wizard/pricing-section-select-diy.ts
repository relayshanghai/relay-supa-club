import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const PRICING_SECTION_SELECT_DIY = 'Signup Wizard, Pricing Section, click to select DIY';

export type PricingSectionSelectDiyPayload = {
    currentPage: CurrentPageEvent;
};

export const PricingSectionSelectDiy = (trigger: TriggerEvent, value?: PricingSectionSelectDiyPayload) =>
    trigger(PRICING_SECTION_SELECT_DIY, { ...value });

PricingSectionSelectDiy.eventName = <typeof PRICING_SECTION_SELECT_DIY>PRICING_SECTION_SELECT_DIY;
