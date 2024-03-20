import { IsString } from 'class-validator';

export class UpdateSubscriptionRequest {
    @IsString()
    coupon!: string;
}
