import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Radio } from '../ui/radio';
import { Button } from '../button';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import type { SignUpValidationErrors } from './signup-page';
import { Spinner } from '../icons';
import { useRef } from 'react';

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
    const companySizeOptions = [
        { label: '1-10', value: 'small' },
        { label: '11-50', value: 'medium' },
        { label: '50 +', value: 'large' },
    ];

    const handleCompanySizeChange = (newValue: string) => {
        setSelectedSize(newValue);
    };

    const invalidFormInput =
        isMissing(companyName) || validationErrors.companyName !== '' || validationErrors.companyWebsite !== '';
    const submitDisabled = invalidFormInput || loading;
    const websiteRef = useRef<HTMLInputElement>(null);
    const sizeRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Input
                label={t('signup.company')}
                value={companyName}
                placeholder={t('signup.companyPlaceholder')}
                required
                onChange={(e) => setAndValidate('companyName', e.target.value)}
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
                disabled={submitDisabled}
                type="submit"
                className="mt-12 flex w-full justify-center"
                onClick={onNext}
            >
                {loading ? <Spinner className="h-5 w-5 fill-primary-600" /> : t('signup.next')}
            </Button>
        </>
    );
};
