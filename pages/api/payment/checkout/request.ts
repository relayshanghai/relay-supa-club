import { IsNumber, IsString } from 'class-validator';
import { type PriceType } from 'src/backend/database/plan/plan-entity';

export class CheckoutRequest {
    @IsString()
    priceId!: string;

    @IsNumber()
    quantity!: number;

    @IsString()
    type!: PriceType;
}
