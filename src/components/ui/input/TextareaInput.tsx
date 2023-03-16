import type { FieldErrorsImpl } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
export interface Props {
    fieldName: string;
    label?: string;
    type?: string;
    register: any;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    placeHolder?: string;
    isRequired?: boolean;
    maxLength?: number;
    minLength?: number;
}
function TextArea({
    fieldName,
    label,
    type = 'text',
    register,
    errors,
    placeHolder,
    isRequired = false,
    maxLength,
    minLength,
}: Props) {
    const { t } = useTranslation();

    return (
        <div>
            <label className="text-xs font-semibold text-gray-600" htmlFor={fieldName}>
                {label}
            </label>
            <textarea
                className="textarea-field"
                cols="30"
                rows="5"
                name={fieldName}
                id={fieldName}
                placeholder={placeHolder}
                type={type}
                {...register(fieldName, {
                    required: { value: isRequired, message: t('website.requiredField') },
                    maxLength: {
                        value: maxLength,
                        message: `${t('website.maxLength')} ${maxLength} ${t(
                            'website.characters',
                        )}`,
                    },
                    minLength: {
                        value: minLength,
                        message: `${t('website.minLength')} ${minLength} ${t(
                            'website.characters',
                        )}`,
                    },
                })}
            />
            <p className="text-xs text-primary-400">
                {errors && errors[fieldName]?.message?.toString()}
            </p>
        </div>
    );
}

export default TextArea;
