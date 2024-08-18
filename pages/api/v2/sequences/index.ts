import SequenceService from 'src/backend/domain/outreach/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { PaginationParam } from 'types/pagination';
import { type GetAllSequenceResponse } from './response';

class SequenceHandler {
    @GET()
    async getAllSequence(@Query(PaginationParam) param: PaginationParam): Promise<GetAllSequenceResponse> {
        return SequenceService.getService().getAllSequences(param);
    }
}

export default createHandler(SequenceHandler);
