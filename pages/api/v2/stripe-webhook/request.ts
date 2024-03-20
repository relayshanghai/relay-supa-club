import { IsOptional, IsString } from 'class-validator';
import type Stripe from 'stripe';

export class Data {
    object!: Stripe.Charge;
}

export class Request {
    @IsOptional()
    id?: null;

    @IsOptional()
    idempotency_key?: null;
}

export class StripeWebhookRequest {
    @IsString()
    id!: string;

    @IsOptional()
    object!: string;

    @IsOptional()
    api_version!: string;

    @IsOptional()
    created!: number;

    @IsOptional()
    data!: Data;

    @IsOptional()
    livemode!: boolean;

    @IsOptional()
    pending_webhooks!: number;

    @IsOptional()
    request!: Request;

    @IsOptional()
    type!: string;
}
