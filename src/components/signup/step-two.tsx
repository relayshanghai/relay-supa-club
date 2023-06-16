import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Button } from '../button';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';

export const StepTwo = ({
    email,
    password,
    confirmPassword,
    validationErrors,
    setAndValidate,
    loading,
    onNext,
    onBack,
}: {
    email: string;
    password: string;
    confirmPassword: string;
    validationErrors: SignUpValidationErrors;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    loading: boolean;
    onNext: any;
    onBack: () => void;
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
            <div className="flex justify-between">
                <Button variant="secondary" className="w-32 lg:w-44" onClick={onBack}>
                    {t('signup.back')}
                </Button>
                <Button disabled={loading} type="submit" className="w-32 lg:w-44" onClick={onNext}>
                    {t('signup.next')}
                </Button>
            </div>
        </>
    );
};
