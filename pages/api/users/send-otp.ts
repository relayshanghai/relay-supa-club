import { POST } from 'src/utils/handler/decorators/api-decorator';
import { type OtpCookieStore, SendOtpRequest } from './request';
import RegistrationService from 'src/backend/domain/user/registration-service';
import type { Cookies } from 'src/utils/handler/cookie';
import { createHandler } from 'src/utils/handler/create-handler';
import { CookieParser } from 'src/utils/handler/decorators/api-cookie-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

export class SentOtpHandler {
    @POST()
    async sendOtp(@CookieParser() cookie: Cookies, @Body(SendOtpRequest) request: SendOtpRequest) {
        await RegistrationService.getService().isPhoneNumberDoesNotExist(request.phoneNumber);
        await RegistrationService.getService().sendOtp(request.phoneNumber, request.hcaptchaToken);
        cookie.set('otpFlow', {
            phoneNumber: request.phoneNumber,
            verified: false,
        } as OtpCookieStore);
        return { message: 'success' };
    }
}
export default createHandler(SentOtpHandler);
