import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSubscriptionRequest {
    @IsString()
    priceId!: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    quantity?: number;
}

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