import { PaginationParam } from 'types/pagination';

export class GetInfluencersRequest extends PaginationParam {
    constructor(page = 1, size = 10) {
        super();
        this.page = page;
        this.size = size;
    }
}
