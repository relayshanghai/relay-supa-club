import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';

export const StepTwo = ({
    email,
    password,
    confirmPassword,
    validationErrors,
    setAndValidate,
}: {
    email: string;
    password: string;
    confirmPassword: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Input
                error={validationErrors.email}
                label={t('signup.email')}
                type="email"
                placeholder="you@site.com"
                value={email}
                required
                onChange={(e) => setAndValidate('email', e.target.value)}
            />
            <Input
                error={validationErrors.password}
                label={t('signup.password')}
                type="password"
                placeholder={t('signup.passwordPlaceholder')}
                value={password}
                required
                onChange={(e) => setAndValidate('password', e.target.value)}
            />
            <Input
                error={validationErrors.confirmPassword}
                label={t('signup.confirmPassword')}
                type="password"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                value={confirmPassword}
                required
                onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
            />
        </>
    );
};
