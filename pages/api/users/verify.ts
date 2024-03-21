import { Body, CookieParser, PUT } from 'src/utils/handler/decorators/api-decorator';
import { type OtpCookieStore, VerifyOtpRequest } from './request';
import RegistrationService from 'src/backend/domain/user/registration-service';
import type { Cookies } from 'src/utils/handler/cookie';
import { createHandler } from 'src/utils/handler/create-handler';
import awaitToError from 'src/utils/await-to-error';

export class VerifyHandler {
    @PUT()
    async sendOtp(@CookieParser() cookie: Cookies, @Body(VerifyOtpRequest) request: VerifyOtpRequest) {
        const otpCookieStore = cookie.get<OtpCookieStore>('otpFlow');
        if (!otpCookieStore) throw new Error('No otp flow found');
        const [err] = await awaitToError(
            RegistrationService.getService().verifyOtp(otpCookieStore.phoneNumber, request.code),
        );
        if (err) {
            cookie.set('otpFlow', {
                phoneNumber: otpCookieStore.phoneNumber,
                verified: false,
            } as OtpCookieStore);
            throw err;
        }
        cookie.set('otpFlow', {
            phoneNumber: otpCookieStore.phoneNumber,
            verified: true,
        } as OtpCookieStore);
        return { message: 'success' };
    }
}

export default createHandler(VerifyHandler);
