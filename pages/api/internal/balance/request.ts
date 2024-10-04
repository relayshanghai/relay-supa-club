import { IsString, ValidateNested } from 'class-validator';
import type { TargetPriceIds } from '../subscriptions/request';

export class BalanceRequest {
    @IsString()
    profile!: number;

    @IsString()
    search!: number;
}

export class SyncBalanceRequest {
    @ValidateNested()
    targetPriceIds!: TargetPriceIds;
}
