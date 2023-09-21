import type { EventPayload, TriggerEvent } from '../../types';

export const NAVIGATE_SIGNUP_CAROUSAL = 'Navigate Signup Carousal';

export type NavigateSignupCarousalPayload = EventPayload<{
    current_slide: number;
    destination_slide: number;
}>;

export const NavigateSignupCarousal = (trigger: TriggerEvent, value?: NavigateSignupCarousalPayload) =>
    trigger(NAVIGATE_SIGNUP_CAROUSAL, value);

export type NavigateSignupCarousal = typeof NavigateSignupCarousal;

NavigateSignupCarousal.eventName = <typeof NAVIGATE_SIGNUP_CAROUSAL>NAVIGATE_SIGNUP_CAROUSAL;
