import { IsOptional, IsString } from 'class-validator';
import { type StripeObjectData } from 'src/backend/database/billing-event/billing-event-entity';

export enum StripeWebhookType {
    CHARGE_SUCCEEDED = 'charge.succeeded',
    CHARGE_FAILED = 'charge.failed',
    INVOICE_PAID = 'invoice.paid',
    INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
    CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
    CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
    CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END = 'customer.subscription.trial_will_end',
}

export class Data<T> {
    object!: T;
}

export class Request {
    @IsOptional()
    id?: null;

    @IsOptional()
    idempotency_key?: null;
}

export class StripeWebhookRequest<TData = StripeObjectData> {
    @IsString()
    id!: string;

    @IsOptional()
    object!: string;

    @IsOptional()
    api_version!: string;

    @IsOptional()
    created!: number;

    @IsOptional()
    data!: Data<TData>;

    @IsOptional()
    livemode!: boolean;

    @IsOptional()
    pending_webhooks!: number;

    @IsOptional()
    request!: Request;

    @IsOptional()
    type!: StripeWebhookType;
}
