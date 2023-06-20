import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SingleSelect } from '../ui';
import { Button } from '../button';
import { companyCategories } from './company-categories';

export const StepThree = ({
    loading,
    onNext,
    setSelectedCategory,
}: {
    loading: boolean;
    onNext: any;
    setSelectedCategory: (newValue: string) => void;
}) => {
    const { t } = useTranslation();
    const {
        control,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const onSubmit = (data: any) => {
        setSelectedCategory(data.companyCategory);
        onNext();
    };

    return (
        <>
            <SingleSelect
                fieldName="companyCategory"
                errors={errors}
                isRequired
                control={control}
                options={companyCategories}
                valueName="companyCategory"
                setValue={setValue}
                className="mb-4"
            />
            <Button disabled={loading} type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
                {t('signup.next')}
            </Button>
        </>
    );
};
