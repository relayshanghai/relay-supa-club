import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Radio } from '../ui/radio';
import { Button } from '../button';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import type { SignUpValidationErrors } from './signup-page';
import { Spinner } from '../icons';
import { useCallback, useRef, useState } from 'react';
import { useCompany } from 'src/hooks/use-company';
import { clientLogger } from 'src/utils/logger-client';

export const StepThree = ({
    companyName,
    companyWebsite,
    setSelectedSize,
    setAndValidate,
    validationErrors,
    loading,
    onNext,
}: {
    companyName: string;
    companyWebsite: string;
    setSelectedSize: (newValue: string) => void;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
    validationErrors: SignUpValidationErrors;
    loading: boolean;
    onNext: any;
}) => {
    const { t } = useTranslation();
    const { companyExists } = useCompany();
    const companySizeOptions = [
        { label: '1-10', value: 'small' },
        { label: '11-50', value: 'medium' },
        { label: '50 +', value: 'large' },
    ];

    const handleCompanySizeChange = (newValue: string) => {
        setSelectedSize(newValue);
    };

    const [companyError, setCompanyError] = useState(false);
    const [inputLoading, setInputLoading] = useState(false);

    const invalidFormInput =
        isMissing(companyName) || validationErrors.companyName !== '' || validationErrors.companyWebsite !== '';
    const submitDisabled = invalidFormInput || loading;
    const websiteRef = useRef<HTMLInputElement>(null);
    const sizeRef = useRef<HTMLInputElement>(null);

    const [existsTimeout, setExistsTimeout] = useState<NodeJS.Timeout | undefined>();
    const [existingOwnerEmail, setExistingOwnerEmail] = useState<string | undefined>();

    const setCompanyExists = useCallback(
        async (name: string) => {
            if (existsTimeout) {
                clearTimeout(existsTimeout);
            }
            setExistsTimeout(
                setTimeout(async () => {
                    try {
                        const res = await companyExists(name);
                        if (res?.exists) {
                            res?.mail && setExistingOwnerEmail(res.mail);
                            setCompanyError(true);
                        } else {
                            setCompanyError(false);
                        }
                    } catch (error: any) {
                        clientLogger(error);
                    }

                    setInputLoading(false);
                }, 1000),
            );
        },
        [existsTimeout, companyExists],
    );

    return (
        <>
            <Input
                label={t('signup.company')}
                value={companyName}
                error={
                    companyError ? t('signup.errorCompanyExists', { companyOwnerEmail: existingOwnerEmail }) : undefined
                }
                loading={inputLoading}
                placeholder={t('signup.companyPlaceholder')}
                required
                onChange={async (e) => {
                    setCompanyError(false);
                    setExistingOwnerEmail(undefined);
                    setAndValidate('companyName', e.target.value);
                    setInputLoading(true);
                    setCompanyExists(e.target.value);
                }}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        websiteRef?.current?.focus();
                    }
                }}
            />
            <Input
                label={t('signup.website')}
                value={companyWebsite}
                placeholder="www.site.com"
                onChange={(e) => setAndValidate('companyWebsite', e.target.value)}
                ref={websiteRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sizeRef?.current?.focus();
                    }
                }}
            />
            <Radio
                label={t('signup.companySize')}
                options={companySizeOptions}
                onValueChange={handleCompanySizeChange}
                ref={sizeRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !submitDisabled) {
                        onNext();
                    }
                }}
            />

            <Button
                disabled={submitDisabled || companyError || inputLoading}
                type="submit"
                className="mt-12 flex w-full justify-center"
                onClick={onNext}
            >
                {loading ? <Spinner className="h-5 w-5 fill-primary-600" /> : t('signup.next')}
            </Button>
        </>
    );
};
