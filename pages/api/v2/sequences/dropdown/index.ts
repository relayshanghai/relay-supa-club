import type { SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import SequenceService from 'src/backend/domain/outreach/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

class SequenceHandler {
    @GET()
    async getDropdown(): Promise<SequenceEntity[]> {
        return SequenceService.getService().getForDropdown();
    }
}

export default createHandler(SequenceHandler);
