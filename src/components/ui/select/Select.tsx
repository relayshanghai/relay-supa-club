import { useTranslation } from 'react-i18next';
import type { KeyboardEventHandler } from 'react';
import { useState } from 'react';
import type { OnChangeValue } from 'react-select';
import Select from 'react-select';
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { LabelValueObject } from 'types';
import CustomStyles from 'src/components/common/Form/CustomStyle';

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
    autoFocus?: boolean;
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
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
    maxLimit = 100,
    autoFocus,
    onKeyDown,
}: MultiSelectProps) {
    const { t } = useTranslation();
    const [optionsSelected, setOptionsSelected] = useState<LabelValueObject[]>([]);

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
                        onChange={(v) => {
                            const val = v as unknown as LabelValueObject[];
                            onChange(val.map((current) => current.value)), setOptionsSelected(val);
                        }}
                        options={options}
                        placeholder={placeholder}
                        isMulti
                        isOptionDisabled={() => optionsSelected.length >= maxLimit}
                        autoFocus={autoFocus}
                        onKeyDown={onKeyDown}
                    />
                )}
            />
            <p className="text-xs text-primary-400">{errors && errors[fieldName]?.message?.toString()}</p>
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
    defaultValue,
    autoFocus,
    onKeyDown,
}: SelectProps) => {
    const { t } = useTranslation();

    return (
        <div className={className} data-testid={fieldName}>
            <Controller
                control={control}
                defaultValue={defaultValue}
                name={fieldName}
                rules={{ required: { value: isRequired, message: t('website.requiredField') } }}
                render={({ field: { value, onChange, ref } }) => (
                    <Select
                        data-testid={fieldName}
                        ref={ref}
                        styles={CustomStyles}
                        value={options.find((c) => c.value === value)}
                        onChange={(v) => {
                            const val = v as unknown as OnChangeValue<LabelValueObject, false>;
                            onChange(val?.value), setValue(valueName ?? '', val?.value);
                        }}
                        options={options}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        onKeyDown={onKeyDown}
                    />
                )}
            />
            <p className="text-xs text-primary-400">{errors && errors[fieldName]?.message?.toString()}</p>
        </div>
    );
};

export { MultiSelect, SingleSelect };
