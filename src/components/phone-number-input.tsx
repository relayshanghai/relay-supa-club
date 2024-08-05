import type { Nullable } from 'types/nullable';

export interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    label: Nullable<string>;
    placeholder: Nullable<string>;
    error: Nullable<string>;
}

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function PhoneNumberInput({ value, onChange, label, placeholder, error }: PhoneNumberInputProps) {
    return (
        <div className="flex-1 flex-col">
            <label className="text-sm font-semibold text-gray-600">{label}</label>
            <PhoneInput
                className="inline-flex h-12 items-center justify-start rounded-md border border-gray-100 bg-white px-1 shadow"
                inputClassName="!border-none focus:outline-none focus:ring-0 "
                countrySelectorStyleProps={{
                    className: '!border-none',
                    buttonClassName: '!border-none',
                }}
                placeholder={placeholder || ''}
                defaultCountry="us"
                value={value}
                onChange={onChange}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
