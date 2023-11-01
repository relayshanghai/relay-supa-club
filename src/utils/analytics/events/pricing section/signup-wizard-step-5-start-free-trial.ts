import type Stripe from 'stripe';
import type { TriggerEvent } from '../../types';

export const SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL = 'Signup Wizard Step 5, clicked on start free trial';

export type SignupWizardStep5StartFreeTrialPayload = {
    customerId: string;
    companyId: string;
    status: Stripe.Subscription.Status;
    priceId: string;
};

export const SignupWizardStep5StartFreeTrial = (
    trigger: TriggerEvent,
    value?: SignupWizardStep5StartFreeTrialPayload,
) => trigger(SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL, { ...value });

SignupWizardStep5StartFreeTrial.eventName = <typeof SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL>(
    SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL
);
