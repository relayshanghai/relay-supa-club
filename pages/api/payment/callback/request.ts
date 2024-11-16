import { IsString } from 'class-validator';

export class PaymentCallbackRequest {
    @IsString()
    paymentIntentId!: string;

    @IsString()
    paymentIntentSecret!: string;

    @IsString()
    redirectStatus!: string;
}
