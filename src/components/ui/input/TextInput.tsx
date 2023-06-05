import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface Props {
    fieldName: string;
    label?: string;
    /** defaults to "text" */
    type?: string;
    register: UseFormRegister<FieldValues>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    placeHolder?: string;
    isRequired?: boolean;
    maximLength?: number;
    minimLength?: number;
}

function TextInput({
    fieldName,
    label,
    type = 'text',
    register,
    errors,
    placeHolder,
    isRequired = false,
    maximLength,
    minimLength,
}: Props) {
    const { t } = useTranslation();

    return (
        <div>
            <label className="text-xs font-semibold text-gray-600" htmlFor={fieldName}>
                {label}
            </label>
            <input
                className="input-field"
                id={fieldName}
                placeholder={placeHolder}
                type={type}
                {...register(fieldName, {
                    required: { value: isRequired, message: t('website.requiredField') },
                    maxLength: maximLength
                        ? {
                              value: maximLength,
                              message: `${t('website.maxLength')} ${maximLength} ${t('website.characters')}`,
                          }
                        : undefined,
                    minLength: minimLength
                        ? {
                              value: minimLength,
                              message: `${t('website.minLength')} ${minimLength} ${t('website.characters')}`,
                          }
                        : undefined,
                })}
            />
            <p className="text-xs text-primary-400">{errors[fieldName]?.message?.toString()}</p>
        </div>
    );
}

export default TextInput;
