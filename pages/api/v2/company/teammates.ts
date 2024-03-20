import httpCodes from 'src/constants/httpCodes';
import { DELETE, Status } from 'src/utils/handler/decorators/api-decorator';
import { DeleteTeammateRequest } from './request';
import RegistrationService from 'src/backend/domain/user/registration-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

class ProfileHandler {
    @DELETE()
    @Status(httpCodes.OK)
    async deleteTeammate(@Query(DeleteTeammateRequest) request: DeleteTeammateRequest) {
        const result = await RegistrationService.getService().deleteProfile(request);
        return {
            ...result,
        };
    }
}

export default createHandler(ProfileHandler);
