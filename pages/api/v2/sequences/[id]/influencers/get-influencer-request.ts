import { IsArray, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from 'types/pagination';

export class GetSequenceInfluencerRequest extends PaginationParam {
    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    funnelStatus?: string;

    @IsNumberString()
    @IsOptional()
    @IsArray()
    sequenceStep?: number[];
}
