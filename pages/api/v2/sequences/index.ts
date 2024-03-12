import SequenceService from 'src/backend/domain/outreach/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

class SequenceHandler {
    @GET()
    async getAllSequence() {
        return SequenceService.getService().getAllSequences();
    }
}

export default createHandler(SequenceHandler);
