import { createHandler } from 'src/utils/handler/create-handler';
import { POST } from 'src/utils/handler/decorators/api-decorator';
import { RegisterRequest } from './request';
import type { Cookies } from 'src/utils/handler/cookie';
import RegistrationService from 'src/backend/domain/user/registration-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { CookieParser } from 'src/utils/handler/decorators/api-cookie-decorator';

export class UserHandler {
    @POST()
    async register(@Body(RegisterRequest) request: RegisterRequest, @CookieParser() cookie: Cookies) {
        const response = await RegistrationService.getService().register(request, cookie);
        return response;
    }
}

export default createHandler(UserHandler);
