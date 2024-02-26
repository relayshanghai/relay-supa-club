import OTP from 'react-otp-input';

export interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
    return (
        <OTP
            containerStyle="flex  bg-white rounded-md shadow border border-gray-100 justify-between items-center inline-flex"
            inputStyle="!w-10 !h-12 text-center outline-none !border-none focus:border-none focus:ring-0 bg-transparent"
            value={value}
            onChange={onChange}
            renderSeparator={<div className="h-[46px] w-px bg-gray-100" />}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
        />
    );
}
