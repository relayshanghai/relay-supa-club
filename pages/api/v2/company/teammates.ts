import httpCodes from 'src/constants/httpCodes';
import { DELETE, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import { DeleteTeammateRequest, UpdateTeammateRoleRequest } from './request';
import RegistrationService from 'src/backend/domain/user/registration-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

class ProfileHandler {
    @PUT()
    @Status(httpCodes.OK)
    async updateTeammateRole(@Body(UpdateTeammateRoleRequest) request: UpdateTeammateRoleRequest) {
        const result = await RegistrationService.getService().updateProfileRole(request);
        return {
            ...result,
        };
    }
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
