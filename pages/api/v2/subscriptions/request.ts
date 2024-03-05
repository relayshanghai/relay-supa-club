import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSubscriptionRequest {
    @IsString()
    priceId!: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    quantity?: number;
}
