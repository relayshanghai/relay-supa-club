import type { ActiveSubscriptionPeriod } from 'src/hooks/use-prices';
import type { TriggerEvent } from '../../types';

export const PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY =
    'Signup Wizard, Pricing Section, click to toggle monthly or quarterly';

export type PricingSectionToggleMonthlyOrQuarterlyPayload = {
    selectedPeriod: ActiveSubscriptionPeriod;
};

export const PricingSectionToggleMonthlyOrQuarterly = (
    trigger: TriggerEvent,
    value?: PricingSectionToggleMonthlyOrQuarterlyPayload,
) => trigger(PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY, { ...value });

PricingSectionToggleMonthlyOrQuarterly.eventName = <typeof PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY>(
    PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY
);
