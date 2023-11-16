import type { EventPayload, TriggerEvent } from '../types';

export const APPLY_PROMO_CODE = 'Apply Promo Code';

export type ApplyPromoCodePayload = EventPayload<{
    promo_code: string;
    selected_plan: string;
}>;

export const ApplyPromoCode = (trigger: TriggerEvent, value?: ApplyPromoCodePayload) =>
    trigger(APPLY_PROMO_CODE, value);

export type ApplyPromoCode = typeof ApplyPromoCode;

ApplyPromoCode.eventName = <typeof APPLY_PROMO_CODE>APPLY_PROMO_CODE;
