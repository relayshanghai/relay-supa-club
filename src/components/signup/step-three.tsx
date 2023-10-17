import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Radio } from '../ui/radio';
import { Button } from '../button';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import type { SignUpValidationErrors } from './signup-page';
import { Spinner } from '../icons';
import { useRef, useState } from 'react';
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

    const setCompanyExists = async (name: string) => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        try {
            const res = await companyExists(name, signal);
            if (res) {
                setCompanyError(true);
            } else {
                setCompanyError(false);
            }
        } catch (error: any) {
            clientLogger(error);
        }

        setInputLoading(false);

        // Abort fetch request after 5 seconds
        setTimeout(() => {
            abortController.abort();
        }, 5000);
    };

    const [debouncedFunction, setDebouncedFunction] = useState<NodeJS.Timeout | undefined>();

    return (
        <>
            <Input
                label={t('signup.company')}
                value={companyName}
                error={companyError ? 'Company already exists' : undefined}
                loading={inputLoading}
                placeholder={t('signup.companyPlaceholder')}
                required
                onChange={async (e) => {
                    if (debouncedFunction) {
                        clearTimeout(debouncedFunction);
                    }
                    setAndValidate('companyName', e.target.value);
                    setInputLoading(true);
                    setDebouncedFunction(
                        setTimeout(() => {
                            setCompanyExists(e.target.value);
                        }, 1000),
                    );
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
