import { IsOptional } from 'class-validator';

export class GetPlansQuery {
    @IsOptional()
    type?: 'top-up' | 'subscription' | 'all';
}
