import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

function DatePicker({ fieldName, label, control, errors, isRequired }) {
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
                            value={value}
                            onChange={(val) => onChange(val)}
                            type="date"
                            name={fieldName}
                            className="input-field mb-2"
                        />
                    </div>
                )}
            />
            <p className="text-xs text-primary-400">
                {errors[fieldName] && errors[fieldName].message}
            </p>
        </div>
    );
}

export default DatePicker;
