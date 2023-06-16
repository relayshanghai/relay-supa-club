import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';

export const StepOne = ({
    firstName,
    lastName,
    phoneNumber,
    validationErrors,
    setAndValidate,
}: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
}) => {
    const { t } = useTranslation();
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
        </>
    );
};
