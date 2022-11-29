import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Select from 'react-select';
import CustomStyles from 'src/components/common/form/CustomStyle.jsx';
import { Controller } from 'react-hook-form';

function MultiSelect({
    fieldName,
    options,
    control,
    errors,
    isRequired,
    placeholder,
    defaultValue,
    maxLimit = 100
}) {
    const { t } = useTranslation();
    const [optionsSelected, setOptionsSelected] = useState([]);

    return (
        <div>
            <Controller
                control={control}
                name={fieldName}
                rules={{ required: { value: isRequired, message: t('website.requiredField') } }}
                render={({ field: { value, onChange, ref } }) => (
                    <Select
                        inputRef={ref}
                        styles={CustomStyles}
                        defaultValue={defaultValue}
                        value={value && options.filter((current) => value.includes(current.value))}
                        onChange={(val) => {
                            onChange(val.map((current) => current.value)), setOptionsSelected(val);
                        }}
                        options={options}
                        placeholder={placeholder}
                        isMulti
                        isOptionDisabled={() => optionsSelected.length >= maxLimit}
                    />
                )}
            />
            <p className="text-xs text-primary-400">
                {errors[fieldName] && errors[fieldName].message}
            </p>
        </div>
    );
}

const SingleSelect = ({
    className,
    fieldName,
    options,
    control,
    errors,
    isRequired,
    placeholder,
    valueName,
    setValue,
    defaultValue
}) => {
    const { t } = useTranslation();

    return (
        <div className={className}>
            <Controller
                control={control}
                defaultValue={defaultValue}
                name={fieldName}
                rules={{ required: { value: isRequired, message: t('website.requiredField') } }}
                render={({ field: { value, onChange, ref } }) => (
                    <Select
                        inputRef={ref}
                        styles={CustomStyles}
                        value={options.find((c) => c.value === value)}
                        onChange={(val) => {
                            onChange(val.value), setValue(valueName, val.value);
                        }}
                        options={options}
                        placeholder={placeholder}
                    />
                )}
            />
            <p className="text-xs text-primary-400">
                {errors[fieldName] && errors[fieldName].message}
            </p>
        </div>
    );
};

export { MultiSelect, SingleSelect };
