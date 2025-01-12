import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { useEffect, useRef, useState } from 'react';
import PhoneNumberInput from '../phone-number-input';
import { useOtp } from 'src/hooks/use-otp';
import OtpInput from '../otp-input';
import Link from 'next/link';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import awaitToError from 'src/utils/await-to-error';
import { clientLogger } from 'src/utils/logger-client';
import { useFormWizard } from 'src/context/form-wizard-context';

const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string;

interface ExecuteResponse {
    response: string;
    key: string;
}

export const StepOne = ({
    firstName,
    lastName,
    phoneNumber,
    validationErrors,
    setAndValidate,
    loading,
}: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    loading: boolean;
}) => {
    const { t } = useTranslation();
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const { loading: otpLoading, sendOtp, verify, counter, isOtpSent, setIsOtpSent, error } = useOtp();
    const [code, setCode] = useState('');
    const captchaRef = useRef<HCaptcha>(null);
    const { currentStep, setCurrentStep } = useFormWizard();

    useEffect(() => {
        if (phoneNumber) setIsOtpSent(false);
    }, [phoneNumber, setIsOtpSent]);
    const triggerSendOtp = async () => {
        setCode('');
        const [err, data] = await awaitToError(
            captchaRef.current?.execute({
                async: true,
            }) as Promise<ExecuteResponse>,
        );
        if (err) return;
        const [errSendOtp] = await awaitToError(sendOtp(phoneNumber, data?.response));
        if (errSendOtp) {
            clientLogger(errSendOtp, 'error');
            captchaRef.current?.resetCaptcha();
        }
    };
    const triggerVerify = async () => {
        const [err, verified] = await awaitToError(verify(code));
        if (err) {
            captchaRef.current?.resetCaptcha();
            return;
        }
        if (verified) {
            setCurrentStep(2);
        }
    };

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
            <div className="mt-5 flex w-full gap-2.5">
                <HCaptcha ref={captchaRef} sitekey={hcaptchaSiteKey} size="invisible" sentry={false} />
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
            {error && <p className="text-sm text-red-500">{error}</p>}
            {currentStep === 1 && (
                <Button disabled={false} loading={loading} className="w-full" onClick={triggerVerify}>
                    {t('signup.next')}
                </Button>
            )}
        </>
    );
};
