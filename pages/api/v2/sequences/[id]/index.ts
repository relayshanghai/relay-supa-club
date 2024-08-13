import SequenceService from 'src/backend/domain/outreach/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class SequenceHandler {
    @GET()
    async getSequence(@Path('id') sequenceId: string) {
        return SequenceService.getService().getById(sequenceId);
    }
}

export default createHandler(SequenceHandler);