import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSubscriptionRequest {
    @IsString()
    priceId!: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    quantity?: number;
}

export class UpdateSubscriptionRequest {
    @IsString()
    email!: string;
}

export class ChangeSubscriptionRequest extends CreateSubscriptionRequest {}

export class PostConfirmationRequest {
    @IsString()
    paymentIntentId!: string;

    @IsString()
    paymentIntentSecret!: string;

    @IsString()
    redirectStatus!: string;

    @IsString()
    subscriptionId!: string;
}

export class CreatePaymentMethodRequest {
    @IsEnum(['card', 'alipay'])
    paymentMethodType!: 'card' | 'alipay';
    @IsString()
    currency!: string;
    @IsString()
    paymentMethodId!: string;
    @IsString()
    userAgent!: string;
}

export class UpdateDefaultPaymentMethodRequest {
    @IsString()
    paymentMethodId!: string;
}

export class RemovePaymentMethodRequest {
    @IsString()
    paymentMethodId!: string;
}
