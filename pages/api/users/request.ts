import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { RequestContext } from 'src/utils/request-context/request-context';

export class RegisterRequest {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsString()
    companyName!: string;

    @IsString()
    companyWebsite!: string;

    @IsString()
    phoneNumber!: string;

    @IsString()
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}

export class SendOtpRequest {
    @IsString()
    @IsPhoneNumber(undefined, {
        message: () => RequestContext.t('signup.phoneNumberIsInvalid'),
    })
    phoneNumber!: string;
}

export class VerifyOtpRequest {
    @IsString()
    code!: string;
}

export interface OtpCookieStore {
    phoneNumber: string;
    verified: boolean;
}
