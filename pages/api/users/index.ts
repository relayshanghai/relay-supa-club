import { createHandler } from 'src/utils/handler/create-handler';
import { Body, CookieParser, POST } from 'src/utils/handler/decorators/api-decorator';
import { type OtpCookieStore, RegisterRequest } from './request';
import type { Cookies } from 'src/utils/handler/cookie';
import RegistrationService from 'src/backend/domain/user/registration-service';

export class UserHandler {
    @POST()
    async register(@Body(RegisterRequest) request: RegisterRequest, @CookieParser() cookie: Cookies) {
        const otpCookieStore = cookie.get<OtpCookieStore>('otpFlow');
        if (!otpCookieStore) throw new Error('No otp flow found');
        if (!otpCookieStore.verified) throw new Error('Phone number not verified');

        await Promise.all([
            RegistrationService.getService().isPhoneNumberDoesNotExist(request.phoneNumber),
            RegistrationService.getService().isEmailDoesNotExist(request.email),
            RegistrationService.getService().isCompanyDoesNotExists(request.companyName),
        ]);
        const response = await RegistrationService.getService().register(request);
        return response;
    }
}

export default createHandler(UserHandler);
