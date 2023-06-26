import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import { useRef } from 'react';

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
    const submitDisabled = invalidFormInput || loading;

    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
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
            <Input
                error={validationErrors.phoneNumber}
                label={t('signup.phoneNumber')}
                placeholder={t('signup.phoneNumberPlaceholder')}
                value={phoneNumber}
                onChange={(e) => setAndValidate('phoneNumber', e.target.value)}
                ref={phoneNumberRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !submitDisabled) {
                        onNext();
                    }
                }}
            />
            <Button disabled={submitDisabled} className="mt-12 w-full" onClick={onNext}>
                {t('signup.next')}
            </Button>
        </>
    );
};
