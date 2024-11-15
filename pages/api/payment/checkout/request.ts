import { IsNumber, IsString } from 'class-validator';

export class CheckoutRequest {
    @IsString()
    priceId!: string;

    @IsNumber()
    quantity!: number;
}
