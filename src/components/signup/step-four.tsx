import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Radio } from '../ui/radio';
import { Button } from '../button';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { isMissing } from 'src/utils/utils';
import type { SignUpValidationErrors } from './signup-page';
import { Spinner } from '../icons';
import { useUser } from 'src/hooks/use-user';
import { useEffect } from 'react';

export const StepFour = ({
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
    const { profile, refreshProfile } = useUser();
    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

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

    const submitDisabled = invalidFormInput || loading || !profile?.id;

    return (
        <>
            <Input
                label={t('signup.company')}
                value={companyName}
                placeholder={t('signup.companyPlaceholder')}
                required
                onChange={(e) => setAndValidate('companyName', e.target.value)}
            />
            <Input
                label={t('signup.website')}
                value={companyWebsite}
                placeholder="www.site.com"
                onChange={(e) => setAndValidate('companyWebsite', e.target.value)}
            />
            <Radio
                label={t('signup.companySize')}
                options={companySizeOptions}
                onValueChange={handleCompanySizeChange}
            />

            <Button disabled={submitDisabled} type="submit" className="flex w-full justify-center" onClick={onNext}>
                {loading ? <Spinner className="h-5 w-5 fill-primary-600" /> : t('signup.next')}
            </Button>
        </>
    );
};
