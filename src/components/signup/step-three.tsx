import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SingleSelect } from '../ui';
import { Button } from '../button';
import { companyCategories } from './company-categories';
import { useUser } from 'src/hooks/use-user';
import { useEffect, useRef } from 'react';

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
    const { refreshProfile } = useUser();

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

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

    const buttonRef = useRef<HTMLButtonElement>(null);
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
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        buttonRef?.current?.focus();
                    }
                }}
            />
            <Button
                ref={buttonRef}
                disabled={loading}
                type="submit"
                className="mt-12 w-full"
                onClick={handleSubmit(onSubmit)}
            >
                {t('signup.next')}
            </Button>
        </>
    );
};
