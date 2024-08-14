import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { POST } from 'src/utils/handler/decorators/api-decorator';
import { SendRequest, SequenceIdParameter } from './request';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

class SequenceHandler {
    @POST()
    async sendSequence(@Query(SequenceIdParameter) query: SequenceIdParameter, @Body(SendRequest) body: SendRequest) {
        return SequenceService.getService().send(query.id, body);
    }
}

export default createHandler(SequenceHandler);
