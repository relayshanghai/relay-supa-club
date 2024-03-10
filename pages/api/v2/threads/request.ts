import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import PaginationParam from 'pages/api/shared/requets';

export enum ThreadStatusRequest {
    UNOPENED = 'unopened',
    UNREPLIED = 'unreplied',
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
    sequences?: string[];

    @IsOptional()
    @IsEnum(FunnelStatusRequest)
    funnelStatus?: FunnelStatusRequest;
}
