import { useForm } from 'react-hook-form';
import { SingleSelect } from '../ui';
import { companyCategories } from './company-categories';

export const StepThree = () => {
    const {
        control,
        // handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

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
            />
        </>
    );
};
