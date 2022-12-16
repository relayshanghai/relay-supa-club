import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Select from 'react-select';
import CustomStyles from 'src/components/common/form/CustomStyle.jsx';
import { Control, Controller, FieldErrorsImpl, FieldValues } from 'react-hook-form';
import { LabelValueObject } from 'types';

interface SelectProps {
    className?: string;
    fieldName: string;
    options: LabelValueObject[];
    control: Control<FieldValues, any>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    isRequired?: boolean;
    placeholder?: string;
    valueName?: string;
    setValue: (name: string, value: any) => void;
    defaultValue?: any;
}
interface MultiSelectProps extends SelectProps {
    maxLimit?: number;
}

function MultiSelect({
    fieldName,
    options,
    control,
    errors,
    isRequired = false,
    placeholder,
    defaultValue,
    maxLimit = 100
}: MultiSelectProps) {
    const { t } = useTranslation();
    const [optionsSelected, setOptionsSelected] = useState<string[]>([]);

    return (
        <div>
            <Controller
                control={control}
                name={fieldName}
                rules={{ required: { value: isRequired, message: t('website.requiredField') } }}
                render={({ field: { value, onChange, ref } }) => (
                    <Select
                        ref={ref}
                        styles={CustomStyles}
                        defaultValue={defaultValue}
                        value={value && options.filter((current) => value.includes(current.value))}
                        onChange={(val) => {
                            onChange(val.map((current) => current.value)),
                                setOptionsSelected(val as string[]);
                        }}
                        options={options}
                        placeholder={placeholder}
                        isMulti
                        isOptionDisabled={() => optionsSelected.length >= maxLimit}
                    />
                )}
            />
            <p className="text-xs text-primary-400">
                {errors && errors[fieldName]?.message?.toString()}
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
    isRequired = false,
    placeholder,
    valueName,
    setValue,
    defaultValue
}: SelectProps) => {
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
                        ref={ref}
                        styles={CustomStyles}
                        value={options.find((c) => c.value === value)}
                        onChange={(val) => {
                            onChange(val?.value), setValue(valueName ?? '', val?.value);
                        }}
                        options={options}
                        placeholder={placeholder}
                    />
                )}
            />
            <p className="text-xs text-primary-400">
                {errors && errors[fieldName]?.message?.toString()}
            </p>
        </div>
    );
};

export { MultiSelect, SingleSelect };
