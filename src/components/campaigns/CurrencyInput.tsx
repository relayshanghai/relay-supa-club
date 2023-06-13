import type { Control, FieldValues, FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SingleSelect } from 'src/components/ui/select/Select';
import { currencyOptions } from './helper';
interface Props {
    isRequired?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    control: Control<FieldValues, any>;
    setValue: (name: string, value: any) => void;
    defaultValue?: any;
}
export default function CurrencyInput({
    isRequired = false,
    register,
    errors,
    control,
    setValue,
    defaultValue,
}: Props) {
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex justify-between">
                <SingleSelect
                    fieldName="budget_currency"
                    errors={errors}
                    isRequired
                    control={control}
                    options={currencyOptions}
                    defaultValue={defaultValue}
                    setValue={setValue}
                    valueName="budget_currency"
                    className="mr-2 w-1/3"
                />
                <input
                    className="input-field"
                    type="number"
                    {...register('budget_cents', {
                        required: { value: isRequired, message: t('website.requiredField') },
                        valueAsNumber: true,
                        max: {
                            value: 999999999999999,
                            message: `${t('website.maxLength')} 999999999999999`,
                        },
                    })}
                    autoComplete="off"
                />
            </div>
            <p className="text-xs text-primary-400">{errors?.budget_cents?.message?.toString()}</p>
        </div>
    );
}
