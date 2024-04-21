import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import { useEffect, useRef, useState } from 'react';
import PhoneNumberInput from '../phone-number-input';
import { useOtp } from 'src/hooks/use-otp';
import OtpInput from '../otp-input';
import Link from 'next/link';
import { useReCaptcha, ReCaptcha } from 'next-recaptcha-v3';

export const StepOne = ({
    firstName,
    lastName,
    phoneNumber,
    validationErrors,
    setAndValidate,
    loading,
    onNext,
}: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    loading: boolean;
    onNext: any;
}) => {
    const { t } = useTranslation();
    const invalidFormInput =
        isMissing(firstName, lastName) || validationErrors.firstName !== '' || validationErrors.lastName !== '';
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const { loading: otpLoading, sendOtp, verify, counter, isOtpSent, setIsOtpSent, error } = useOtp();
    const [code, setCode] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState<string>();

    const submitDisabled = invalidFormInput || loading || otpLoading || !isOtpSent || code.length !== 6;
    useEffect(() => {
        if (phoneNumber) setIsOtpSent(false);
    }, [phoneNumber, setIsOtpSent]);

    const triggerSendOtp = async () => {
        setCode('');
        await sendOtp(phoneNumber, recaptchaToken);
    };
    const triggerVerify = async () => {
        const verified = await verify(code);
        if (verified) {
            onNext();
        }
    };
    const { error: recaptchaError } = useReCaptcha();

    return (
        <>
            <Input
                error={validationErrors.firstName}
                label={t('signup.firstName')}
                value={firstName}
                placeholder={t('signup.firstNamePlaceholder')}
                required
                onChange={(e) => setAndValidate('firstName', e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        lastNameRef?.current?.focus();
                    }
                }}
            />
            <Input
                error={validationErrors.lastName}
                label={t('signup.lastName')}
                placeholder={t('signup.lastNamePlaceholder')}
                value={lastName}
                required
                onChange={(e) => setAndValidate('lastName', e.target.value)}
                ref={lastNameRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        phoneNumberRef?.current?.focus();
                    }
                }}
            />
            <div className="flex items-end justify-end gap-2.5">
                <PhoneNumberInput
                    error={validationErrors.phoneNumber}
                    label={t('signup.phoneNumber')}
                    placeholder={t('signup.phoneNumberPlaceholder')}
                    value={phoneNumber}
                    onChange={(e) => setAndValidate('phoneNumber', e)}
                />

                {!isOtpSent && (
                    <Button className="flex" disabled={isOtpSent} loading={otpLoading} onClick={() => triggerSendOtp()}>
                        {t('signup.verify')}
                    </Button>
                )}
            </div>
            {isOtpSent && (
                <div className="mt-5 flex gap-2.5">
                    <OtpInput value={code} onChange={setCode} />
                    <div>
                        <div className="w-[165px] font-['Poppins'] text-sm font-semibold text-gray-600 ">
                            {t(`signup.enterVerificationCode`)}
                        </div>
                        <div className="font-['Poppins'] text-sm font-medium text-gray-400">
                            {counter === 0 ? (
                                <>
                                    {t('signup.didntGetTheOtp')}
                                    <Link
                                        href="#"
                                        className={`font-['Poppins'] text-sm font-medium tracking-tight text-violet-600`}
                                        onClick={() => triggerSendOtp()}
                                    >
                                        Resend
                                    </Link>
                                </>
                            ) : (
                                t('signup.countdown', {
                                    timer: counter,
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ReCaptcha
                onValidate={(t) => {
                    setRecaptchaToken(t);
                }}
                action="page_view"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {recaptchaError && <p className="text-sm text-red-500">{t('signup.recaptchaError')}</p>}
            <Button disabled={submitDisabled} loading={loading} className="mt-12 w-full" onClick={triggerVerify}>
                {t('signup.next')}
            </Button>
        </>
    );
};
