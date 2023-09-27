import type { EventPayload, TriggerEvent } from '../../types';

export const PAY_FOR_UPGRADED_PLAN = 'Pay for Upgraded Plan';

export type PayForUpgradedPlanPayload = EventPayload<{
    successful: boolean;
    stripe_error_code?: string;
    batch_id: number;
}>;

export const PayForUpgradedPlan = (trigger: TriggerEvent, value?: PayForUpgradedPlanPayload) =>
    trigger(PAY_FOR_UPGRADED_PLAN, value);

export type PayForUpgradedPlan = typeof PayForUpgradedPlan;

PayForUpgradedPlan.eventName = <typeof PAY_FOR_UPGRADED_PLAN>PAY_FOR_UPGRADED_PLAN;
