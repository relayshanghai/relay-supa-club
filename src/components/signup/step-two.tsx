import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import type { SignUpValidationErrors } from './signup-page';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { useCallback, useRef, useState } from 'react';
import { userExists } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';
import { useFormWizard } from 'src/context/form-wizard-context';

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
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

    const [inputLoading, setInputLoading] = useState(false);
    const [existsTimeout, setExistsTimeout] = useState<NodeJS.Timeout | undefined>();

    const [userError, setUserError] = useState(false);

    const setEmailExists = useCallback(
        async (email: string) => {
            if (existsTimeout) {
                clearTimeout(existsTimeout);
            }
            setExistsTimeout(
                setTimeout(async () => {
                    try {
                        const res = await userExists(email);
                        if (res?.exists) {
                            setUserError(true);
                        } else {
                            setUserError(false);
                        }
                    } catch (error: any) {
                        clientLogger(error);
                    }

                    setInputLoading(false);
                }, 1000),
            );
        },
        [existsTimeout],
    );

    const { currentStep } = useFormWizard();

    return (
        <>
            {currentStep !== 1 && (
                <>
                    <Input
                        error={userError ? t('login.userAlreadyExists') : validationErrors.email}
                        label={t('signup.email')}
                        type="email"
                        loading={inputLoading}
                        placeholder="you@site.com"
                        value={email}
                        required
                        onChange={(e) => {
                            setUserError(false);
                            setAndValidate('email', e.target.value);
                            setInputLoading(true);
                            setEmailExists(e.target.value);
                        }}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                passwordRef?.current?.focus();
                            }
                        }}
                    />
                    <Input
                        error={validationErrors.password}
                        label={t('signup.password')}
                        type="password"
                        placeholder={t('signup.passwordPlaceholder')}
                        value={password}
                        required
                        onChange={(e) => setAndValidate('password', e.target.value)}
                        ref={passwordRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                passwordConfirmRef?.current?.focus();
                            }
                        }}
                    />
                    <Input
                        error={validationErrors.confirmPassword}
                        label={t('signup.confirmPassword')}
                        type="password"
                        placeholder={t('signup.confirmPasswordPlaceholder')}
                        value={confirmPassword}
                        required
                        onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
                        ref={passwordConfirmRef}
                    />
                </>
            )}
        </>
    );
};
