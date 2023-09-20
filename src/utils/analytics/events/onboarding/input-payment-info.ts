import type { EventPayload, TriggerEvent } from '../../types';

export const INPUT_PAYMENT_INFO = 'Input Payment Info';

export type InputPaymentInfoPayload = EventPayload<{
    complete: boolean;
    empty: boolean;
    type: string;
}>;

export const InputPaymentInfo = (trigger: TriggerEvent, value?: InputPaymentInfoPayload) =>
    trigger(INPUT_PAYMENT_INFO, value);

export type InputPaymentInfo = typeof InputPaymentInfo;

InputPaymentInfo.eventName = <typeof INPUT_PAYMENT_INFO>INPUT_PAYMENT_INFO;
