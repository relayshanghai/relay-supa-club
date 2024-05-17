import { Transform, type TransformFnParams } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from 'types/pagination';

export enum ThreadStatusRequest {
    UNOPENED = 'unopened',
    UNREPLIED = 'unreplied',
    ALL = 'all',
}

export enum FunnelStatusRequest {
    Negotiating = 'Negotiating',
    Confirmed = 'Confirmed',
    Shipped = 'Shipped',
    Rejected = 'Rejected',
    Received = 'Received',
    Completed = 'Completed',
    ContentApproval = 'Content Approval',
    Posted = 'Posted',
}

export class GetThreadsRequest extends PaginationParam {
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @IsOptional()
    @IsEnum(ThreadStatusRequest)
    threadStatus?: ThreadStatusRequest;

    @IsString({
        each: true,
    })
    @IsOptional()
    @IsArray()
    @Transform((param: TransformFnParams) => {
        return param.value.split(',');
    })
    sequences?: string[];

    @IsOptional()
    @IsArray()
    @IsEnum(FunnelStatusRequest, {
        each: true,
    })
    @Transform((param: TransformFnParams) => {
        return param.value.split(',');
    })
    funnelStatus?: FunnelStatusRequest[];
}

export class ReadThreadRequest {
    @IsArray()
    ids!: string[];
}
