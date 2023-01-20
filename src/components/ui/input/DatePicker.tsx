import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrorsImpl, FieldValues } from 'react-hook-form';
import dateFormat from 'src/utils/dateFormat';
export interface Props {
    fieldName: string;
    label: string;
    control: Control<FieldValues, any>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    isRequired: boolean;
}
function DatePicker({ fieldName, label, control, errors, isRequired }: Props) {
    const { t } = useTranslation();

    return (
        <div>
            <Controller
                control={control}
                name={fieldName}
                rules={{ required: { value: isRequired, message: t('website.requiredField') } }}
                render={({ field: { value, onChange } }) => (
                    <div>
                        <label htmlFor={fieldName} className="text-xs text-gray-600 pl-2">
                            {label}
                        </label>
                        <input
                            value={dateFormat(value, 'isoDate', true, true)}
                            onChange={(val) => onChange(val)}
                            type="date"
                            name={fieldName}
                            className="input-field mb-2"
                        />
                    </div>
                )}
            />
            <p className="text-xs text-primary-400">
                {errors[fieldName] && errors[fieldName]?.message?.toString()}
            </p>
        </div>
    );
}

export default DatePicker;
