import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';

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

    return (
        <>
            <Input
                error={validationErrors.firstName}
                label={t('signup.firstName')}
                value={firstName}
                placeholder={t('signup.firstNamePlaceholder')}
                required
                onChange={(e) => setAndValidate('firstName', e.target.value)}
            />
            <Input
                error={validationErrors.lastName}
                label={t('signup.lastName')}
                placeholder={t('signup.lastNamePlaceholder')}
                value={lastName}
                required
                onChange={(e) => setAndValidate('lastName', e.target.value)}
            />
            <Input
                error={validationErrors.phoneNumber}
                label={t('signup.phoneNumber')}
                placeholder={t('signup.phoneNumberPlaceholder')}
                value={phoneNumber}
                onChange={(e) => setAndValidate('phoneNumber', e.target.value)}
            />
            <Button disabled={submitDisabled} className="mt-12 w-full" onClick={onNext}>
                {t('signup.next')}
            </Button>
        </>
    );
};
