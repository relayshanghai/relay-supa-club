import { UseFormRegister, FieldValues, FieldErrorsImpl } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LabelValueObject } from 'types';

export interface Props {
    fieldName: string;
    register: UseFormRegister<FieldValues>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    options: LabelValueObject[];
    isRequired?: boolean;
}

function Checkbox({ fieldName, register, errors, options, isRequired = false }: Props) {
    const { t } = useTranslation();

    return (
        <div>
            {options.map((type, index) => {
                return (
                    <div key={index} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            id={type.value}
                            className="checkbox"
                            {...register(fieldName, {
                                required: {
                                    value: isRequired,
                                    message: t('website.requiredField'),
                                },
                            })}
                            value={type.value}
                        />
                        <label htmlFor={type.value} className="text-sm text-gray-600 hover">
                            {t(type.label)}
                        </label>
                    </div>
                );
            })}
            <p className="text-xs text-primary-400">{errors[fieldName]?.message?.toString()}</p>
        </div>
    );
}
export default Checkbox;
