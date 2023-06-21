import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import { Spinner } from '../icons';

export const StepTwo = ({
    email,
    password,
    confirmPassword,
    validationErrors,
    setAndValidate,
    loading,
    onNext,
}: {
    email: string;
    password: string;
    confirmPassword: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    loading: boolean;
    onNext: any;
}) => {
    const { t } = useTranslation();
    const invalidFormInput =
        isMissing(email, password, confirmPassword) ||
        validationErrors.email !== '' ||
        validationErrors.password !== '' ||
        validationErrors.confirmPassword !== '';
    const submitDisabled = invalidFormInput || loading;

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

            <Button disabled={submitDisabled} type="submit" className="flex w-full justify-center" onClick={onNext}>
                {loading ? <Spinner className="h-5 w-5 fill-primary-600" /> : t('signup.next')}
            </Button>
        </>
    );
};
