import { useTranslation } from 'react-i18next';
import { Input } from '../input';
import { Radio } from '../ui/radio';
import type { SignupInputTypes } from 'src/utils/validation/signup';

export const StepFour = ({
    companyName,
    companyWebsite,
    setSelectedSize,
    setAndValidate,
}: {
    companyName: string;
    companyWebsite: string;
    setSelectedSize: (newValue: string) => void;
    setAndValidate: (type: SignupInputTypes, value: string) => void;
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
        </>
    );
};
