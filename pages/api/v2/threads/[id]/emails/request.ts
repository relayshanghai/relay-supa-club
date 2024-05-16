import { PaginationParam } from 'types/pagination';

export class GetThreadEmailsRequest extends PaginationParam {
    threadId!: string;
}
