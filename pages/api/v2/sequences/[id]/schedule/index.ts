import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { POST } from 'src/utils/handler/decorators/api-decorator';
import { SendRequest } from './request';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

class SequenceHandler {
    @POST()
    async sendSequence(@Path('id') id: string, @Body(SendRequest) body: SendRequest) {
        return SequenceService.getService().send(id, body);
    }
}

export default createHandler(SequenceHandler);
